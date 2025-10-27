# llm/dependencies.py

from pipelines.p2_evaluator import LLMManager, SimilarityEvaluator
from core.config import settings

# --- 싱글톤 인스턴스 생성 ---
# 서버 전체에서 공유될 유일한 인스턴스들을 미리 생성합니다.
# 실제 모델 로딩은 서버가 시작될 때 main.py의 startup 이벤트에서 처리됩니다.

p2_llm_manager = LLMManager(model_name=settings.MODEL_NAME)
similarity_evaluator = SimilarityEvaluator(model_name=settings.EMBEDDING_MODEL)


# --- 의존성 주입용 Getter 함수 ---
# FastAPI의 Depends() 시스템이 이 함수들을 호출하여
# API 엔드포인트에 미리 생성된 싱글톤 인스턴스를 "주입"해줍니다.

def get_p2_llm_manager() -> LLMManager:
    """
    P2 평가용 LLMManager 싱글톤 인스턴스를 반환합니다.
    """
    return p2_llm_manager

def get_similarity_evaluator() -> SimilarityEvaluator:
    """
    SimilarityEvaluator 싱글톤 인스턴스를 반환합니다.
    """
    return similarity_evaluator