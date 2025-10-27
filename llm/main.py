# llm/main.py

import json
import logging
import time
import random
import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel

# 각 모듈에서 필요한 클래스, 함수, 객체들을 가져옵니다.
from schemas import (
    EvaluationCriteriaRequest, EvaluationCriteriaResponse,
    ApplicationSubmitRequest, ApplicationSubmitResponse, EvaluationResult
)
from dependencies import get_p2_llm_manager, get_similarity_evaluator
from pipelines.p1_builder import run_p1_pipeline
from pipelines.p2_evaluator import run_p2_pipeline, LLMManager, SimilarityEvaluator
from core.config import settings

# --- 로깅 및 FastAPI 앱 설정 ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Pickle AI Evaluation API",
    description="지원서 평가를 위한 AI 모델 서버 API",
    version="1.0.0"
)

# --- 헬퍼 함수 ---
def load_json_file(file_path: str) -> dict:
    """JSON 파일을 로드하는 헬퍼 함수"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning(f"파일을 찾을 수 없습니다: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"JSON 파싱 오류: {e}")
        return {}

def save_evaluation_result_to_json(evaluation_result: dict):
    """평가 결과를 JSON 파일로 저장하는 함수"""
    try:
        # 결과 저장 디렉토리 생성
        results_dir = "evaluation_results"
        os.makedirs(results_dir, exist_ok=True)
        
        # 파일명: application_{applicationId}_{timestamp}.json
        application_id = evaluation_result.get('applicationId', 'unknown')
        timestamp = int(time.time())
        filename = f"application_{application_id}_{timestamp}.json"
        file_path = os.path.join(results_dir, filename)
        
        # JSON 파일로 저장
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(evaluation_result, f, ensure_ascii=False, indent=2)
        
        logger.info(f"평가 결과 JSON 저장 완료: {file_path}")
        
        # 최신 결과를 위한 심볼릭 링크 생성 (application_{id}_latest.json)
        latest_filename = f"application_{application_id}_latest.json"
        latest_file_path = os.path.join(results_dir, latest_filename)
        
        # 기존 심볼릭 링크가 있으면 삭제
        if os.path.exists(latest_file_path):
            os.remove(latest_file_path)
        
        # 새 심볼릭 링크 생성
        os.symlink(filename, latest_file_path)
        logger.info(f"최신 결과 심볼릭 링크 생성: {latest_file_path}")
        
    except Exception as e:
        logger.error(f"평가 결과 JSON 저장 실패: {e}")

def load_evaluation_result_from_json(application_id: str) -> dict:
    """특정 지원서의 평가 결과를 JSON에서 로드하는 함수"""
    try:
        results_dir = "evaluation_results"
        latest_file_path = os.path.join(results_dir, f"application_{application_id}_latest.json")
        
        if os.path.exists(latest_file_path):
            with open(latest_file_path, 'r', encoding='utf-8') as f:
                result = json.load(f)
                logger.info(f"평가 결과 JSON 로드 완료: {latest_file_path}")
                return result
        else:
            logger.warning(f"평가 결과 파일을 찾을 수 없습니다: {latest_file_path}")
            return {}
            
    except Exception as e:
        logger.error(f"평가 결과 JSON 로드 실패: {e}")
        return {}

def run_p2_evaluation_background(applicant_data: dict, llm_manager: LLMManager, similarity_evaluator: SimilarityEvaluator):
    """
    백그라운드에서 P2 평가를 수행하는 함수
    """
    try:
        application_id = applicant_data.get('applicationId', 'Unknown')
        applicant_name = applicant_data.get('applicantName', 'Unknown')
        
        logger.info(f"백그라운드 P2 평가 시작 - Application ID: {application_id}, 지원자: {applicant_name}")
        
        # P2 파이프라인 전체 실행
        final_report_dict = run_p2_pipeline(
            applicant_data=applicant_data,
            llm_manager=llm_manager,
            similarity_evaluator=similarity_evaluator
        )
        
        # 평가 결과를 JSON 파일로 저장
        save_evaluation_result_to_json(final_report_dict)
        
        # 평가 결과를 Spring Boot 서버로 전송
        send_evaluation_result_to_spring_boot(final_report_dict)
        
        logger.info(f"백그라운드 P2 평가 완료 - Application ID: {application_id}, 지원자: {applicant_name}")
        
    except Exception as e:
        application_id = applicant_data.get('applicationId', 'Unknown')
        applicant_name = applicant_data.get('applicantName', 'Unknown')
        logger.error(f"백그라운드 P2 평가 실패 - Application ID: {application_id}, 지원자: {applicant_name}, 오류: {e}", exc_info=True)

def send_evaluation_result_to_spring_boot(evaluation_result):
    """
    평가 결과를 Spring Boot로 전송 (Fire-and-Forget)
    연결 실패 시에도 성공으로 처리
    """
    # evaluation_result가 dict인지 확인하고 적절히 처리
    if isinstance(evaluation_result, dict):
        applicant_name = evaluation_result.get('applicantName', 'Unknown')
        logger.info(f"평가 결과 전송 시도 - 지원자: {applicant_name}")
    else:
        applicant_name = evaluation_result.applicantName
        logger.info(f"평가 결과 전송 시도 - 지원자: {applicant_name}")
    
    import requests
    spring_boot_url = "http://localhost:8080/api/applications/evaluation-result"
    
    # dict인 경우 그대로 전송, 객체인 경우 dict()로 변환
    json_data = evaluation_result if isinstance(evaluation_result, dict) else evaluation_result.dict()
    
    try:
        # 동기 HTTP 요청으로 Spring Boot에 전송 (더 긴 타임아웃)
        response = requests.post(spring_boot_url, json=json_data, timeout=120)  # 2분 타임아웃
        logger.info(f"평가 결과 전송 성공 - 지원자: {applicant_name}, 상태코드: {response.status_code}")
    except Exception as e:
        # 함수 전체에서 발생할 수 있는 모든 예외를 잡아서 처리
        logger.error(f"send_evaluation_result_to_spring_boot 함수에서 예상치 못한 오류 발생: {e}")
        logger.info("함수 실행 중 오류가 발생했지만 평가 프로세스를 성공으로 처리합니다")
        # 예외를 다시 발생시키지 않고 성공으로 처리



# --- FastAPI 이벤트 핸들러 ---
@app.on_event("startup")
async def startup_event():
    """서버 시작 시 P2 평가용 AI 모델들을 미리 로드합니다."""
    logger.info("서버 시작. P2 평가용 공유 모델들을 메모리에 로드합니다...")
    # 의존성 모듈에 생성된 싱글톤 인스턴스의 모델 로드 메서드를 호출
    get_p2_llm_manager().load_model()
    get_similarity_evaluator()._load_model() # private 메서드지만, 초기 로딩을 위해 호출
    logger.info("모든 공유 모델 로딩 완료. API가 준비되었습니다.")

# --- API 엔드포인트 정의 ---

@app.get("/")
async def root():
    return {"message": "Pickle AI Evaluation API is running."}


@app.post("/api/evaluation-criteria/train", response_model=EvaluationCriteriaResponse)
async def train_evaluation_criteria(
    request: EvaluationCriteriaRequest,
    background_tasks: BackgroundTasks
):
    """
    [P1] 평가 기준을 받아 평가 자산을 생성하고 RAG DB를 구축하는 '학습' API
    """
    logger.info(f"P1 학습 요청 수신 - JobPosting ID: {request.jobPostingId}")
    
    # 예시 데이터 파일 로드
    logger.info(f"📁 예시 데이터 파일 로딩 시작: {settings.EXAMPLES_FILE}")
    examples_data = load_json_file(settings.EXAMPLES_FILE)
    if examples_data:
        logger.info(f"✅ 예시 데이터 로딩 성공 - {len(examples_data)}개 항목")
    else:
        logger.warning(f"⚠️ 예시 데이터 로딩 실패 또는 파일 없음: {settings.EXAMPLES_FILE}")
    
    # P1 파이프라인은 무거운 작업이므로 백그라운드에서 실행
    background_tasks.add_task(
        run_p1_pipeline, 
        eval_criteria_data=request.dict(),
        examples_data=examples_data
    )
    
    return EvaluationCriteriaResponse(
        success=True,
        message="평가 기준 학습(P1)을 백그라운드에서 시작했습니다. 완료까지 몇 분 정도 소요될 수 있습니다.",
        jobPostingId=request.jobPostingId  # camelCase로 변경
    )


@app.post("/api/applications/submit", response_model=ApplicationSubmitResponse)
async def submit_application(
    request: ApplicationSubmitRequest,
    background_tasks: BackgroundTasks,
    # 의존성 주입: 미리 로드된 모델 객체들을 가져옴
    llm_manager: LLMManager = Depends(get_p2_llm_manager),
    similarity_eval: SimilarityEvaluator = Depends(get_similarity_evaluator)
):
    """
    [P2] 지원서를 받아 AI 평가를 백그라운드에서 수행하는 API
    Spring Boot가 비동기로 변경되었으므로 FastAPI도 즉시 응답 후 백그라운드 처리
    """
    logger.info(f"P2 평가 요청 수신 - Application ID: {request.applicationId}")

    # 백그라운드에서 평가 수행
    background_tasks.add_task(
        run_p2_evaluation_background,
        applicant_data=request.dict(),
        llm_manager=llm_manager,
        similarity_evaluator=similarity_eval
    )
    
    logger.info(f"P2 평가 백그라운드 작업 시작 - Application ID: {request.applicationId}")
    
    return ApplicationSubmitResponse(
        success=True,
        message="지원서 평가(P2)를 백그라운드에서 시작했습니다. 평가 완료까지 몇 분 정도 소요될 수 있습니다.",
        applicationId=request.applicationId
    )

@app.get("/api/applications/{application_id}/evaluation-result")
async def get_evaluation_result(application_id: str):
    """
    특정 지원서의 평가 결과를 조회하는 API
    프론트엔드에서 "지원서 평가" 버튼을 눌렀을 때 호출
    """
    logger.info(f"평가 결과 조회 요청 - Application ID: {application_id}")
    
    try:
        # JSON 파일에서 평가 결과 로드
        evaluation_result = load_evaluation_result_from_json(application_id)
        
        if evaluation_result:
            logger.info(f"평가 결과 조회 성공 - Application ID: {application_id}")
            return {
                "success": True,
                "message": "평가 결과를 성공적으로 조회했습니다.",
                "applicationId": application_id,
                "evaluationResult": evaluation_result
            }
        else:
            logger.warning(f"평가 결과 없음 - Application ID: {application_id}")
            return {
                "success": False,
                "message": "평가 결과를 찾을 수 없습니다. 평가가 아직 완료되지 않았거나 진행 중입니다.",
                "applicationId": application_id,
                "evaluationResult": None
            }
            
    except Exception as e:
        logger.error(f"평가 결과 조회 실패 - Application ID: {application_id}, 오류: {e}")
        return {
            "success": False,
            "message": f"평가 결과 조회 중 오류가 발생했습니다: {str(e)}",
            "applicationId": application_id,
            "evaluationResult": None
        }

# --- 개발용 서버 실행 ---
# 이 파일이 직접 실행될 때 uvicorn 서버를 구동합니다.
# (실제 배포 시에는 gunicorn + uvicorn 워커를 사용합니다.)
if __name__ == "__main__":
    import uvicorn
    import sys
    
    # 파일 감시 관련 오류 방지를 위한 설정
    config = uvicorn.Config(
        "llm.main:app",
        host="0.0.0.0",
        port=8001,
        reload=False,
        workers=1,
        log_level="info",
        access_log=False,
        # 파일 감시 비활성화
        reload_dirs=None,
        reload_includes=None,
        reload_excludes=None
    )
    
    server = uvicorn.Server(config)
    try:
        server.run()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다...")
        sys.exit(0)