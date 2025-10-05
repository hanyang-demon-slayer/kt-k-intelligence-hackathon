# llm/schemas.py

from pydantic import BaseModel, validator
from typing import List, Optional

# Spring ResumeItemType과 매칭되는 타입 상수들
RESUME_ITEM_TYPES = [
    "숫자", "날짜", "파일", "텍스트", "카테고리", 
    "숫자 범위", "규칙 기반 개수", "점수 범위", 
    "기간 기반", "시간 범위"
]

# --- /api/evaluation-criteria/train (학습) API 모델 ---

class ResumeItemCriterion(BaseModel):
    grade: str
    description: str
    scorePerGrade: int  # camelCase로 변경

class ResumeItem(BaseModel):
    id: int
    name: str
    type: str  # Spring ResumeItemType의 description 값과 매칭
    scoreWeight: int  # camelCase로 변경
    isRequired: bool  # camelCase로 변경
    criteria: List[ResumeItemCriterion]
    
    @validator('type')
    def validate_type(cls, v):
        """Spring ResumeItemType과 일치하는지 검증"""
        if v not in RESUME_ITEM_TYPES:
            raise ValueError(f'Invalid resume item type: {v}. Must be one of {RESUME_ITEM_TYPES}')
        return v
    
    class Config:
        # Spring에서 보내는 가능한 type 값들
        schema_extra = {
            "example": {
                "id": 1,
                "name": "학력",
                "type": "텍스트",  # Spring ResumeItemType의 description 값
                "scoreWeight": 20,
                "isRequired": True,
                "criteria": []
            }
        }

class CoverLetterQuestionCriterionDetail(BaseModel):
    grade: str
    description: str

class CoverLetterQuestionCriterion(BaseModel):
    name: str
    details: List[CoverLetterQuestionCriterionDetail]

class CoverLetterQuestion(BaseModel):
    id: int
    content: str
    isRequired: bool
    maxCharacters: int
    criteria: List[CoverLetterQuestionCriterion]

class EvaluationCriteriaRequest(BaseModel):
    """'학습' 요청 시 백엔드에서 받는 평가 기준 전체 데이터 모델"""
    jobPostingId: int
    title: str
    companyName: str
    jobRole: str
    totalScore: int
    passingScore: int
    aiAutomaticEvaluation: bool  # Spring Boot에서 보내는 필드 추가
    manualReview: bool  # Spring Boot에서 보내는 필드 추가
    timestamp: int  # Spring Boot에서 보내는 필드 추가
    resumeItems: List[ResumeItem]
    coverLetterQuestions: List[CoverLetterQuestion]

class EvaluationCriteriaResponse(BaseModel):
    """'학습' 요청에 대한 응답 모델"""
    success: bool
    message: str
    jobPostingId: int  # camelCase로 변경

# --- /api/applications/submit (평가) API 모델 ---

class ResumeAnswer(BaseModel):
    resumeItemId: int
    resumeItemName: str
    resumeContent: Optional[str] = None
    selectedCategory: Optional[str] = None # 수상경력 등을 위함

class CoverLetterAnswer(BaseModel):
    coverLetterQuestionId: int
    questionContent: str
    answerContent: str

class ApplicationSubmitRequest(BaseModel):
    """'평가' 요청 시 백엔드에서 받는 지원서 전체 데이터 모델"""
    applicantId: int
    applicantName: str
    applicantEmail: str
    applicationId: int
    jobPostingId: int
    resumeItemAnswers: List[ResumeAnswer]
    coverLetterQuestionAnswers: List[CoverLetterAnswer]

class ApplicationSubmitResponse(BaseModel):
    """'평가' 요청에 대한 응답 모델"""
    success: bool
    message: str
    applicationId: int  # camelCase로 변경

# --- 최종 평가 결과 (EvaluationResult) 모델 ---
# P2 파이프라인이 생성하고 Spring Boot으로 전송할 최종 리포트의 형식입니다.

class ResumeEvaluation(BaseModel):
    resumeItemId: int  # Spring Boot에서 Long으로 변환됨
    resumeItemName: str
    resumeContent: str
    score: int

class CoverLetterAnswerEvaluation(BaseModel):
    evaluationCriteriaName: str
    grade: str
    evaluatedContent: str
    evaluationReason: str

class CoverLetterQuestionEvaluation(BaseModel):
    coverLetterQuestionId: int  # Spring Boot에서 Long으로 변환됨
    keywords: List[str]
    summary: str
    answerEvaluations: List[CoverLetterAnswerEvaluation]

class OverallAnalysis(BaseModel):
    overallEvaluation: str
    strengths: List[str]
    improvements: List[str]
    aiRecommendation: str
    aiReliability: float

class EvaluationResult(BaseModel):
    """최종 평가 리포트 전체 데이터 모델"""
    applicantId: int  # Spring Boot에서 Long으로 변환됨
    applicantName: str
    applicantEmail: str
    applicationId: int  # Spring Boot에서 Long으로 변환됨
    jobPostingId: int  # Spring Boot에서 Long으로 변환됨
    resumeEvaluations: List[ResumeEvaluation]
    coverLetterQuestionEvaluations: List[CoverLetterQuestionEvaluation]
    overallAnalysis: OverallAnalysis