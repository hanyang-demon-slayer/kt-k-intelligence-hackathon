# llm/pipelines/p2_evaluator.py

import json
import torch
import re
import gc
from tqdm import tqdm
from transformers import AutoTokenizer, AutoModelForCausalLM
import chromadb
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from core.config import settings # core/config.py에서 설정값 가져오기

# --- P2용 헬퍼 함수 ---
def load_json_file(filepath):
    """JSON 파일을 안전하게 로드하는 함수"""
    try:
        print(f"📁 JSON 파일 로딩 시도: {filepath}")
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"✅ JSON 파일 로딩 성공: {filepath}")
            return data
    except FileNotFoundError:
        print(f"❌ JSON 파일을 찾을 수 없습니다: {filepath}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ JSON 파싱 오류: {filepath} - {e}")
        return None

# --- P2 파이프라인의 구성 요소들 ---

class SimilarityEvaluator:
    """문장 임베딩과 코사인 유사도 계산을 전담하는 클래스"""
    _instance = None
    _model = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SimilarityEvaluator, cls).__new__(cls)
        return cls._instance

    def _load_model(self):
        if self._model is None:
            print("🔄 직무 유사도 평가를 위한 임베딩 모델을 로드합니다...")
            self._model = SentenceTransformer(settings.EMBEDDING_MODEL)
            print("✅ 임베딩 모델 로드 완료.")

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """두 텍스트의 코사인 유사도를 계산합니다."""
        self._load_model()
        embeddings = self._model.encode([text1, text2])
        return cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]

class LLMManager:
    """P2 평가용 LLM 모델을 관리하는 클래스 (dependencies.py에서 공유됨)"""
    def __init__(self, model_name):
        self.model_name = model_name
        self.model, self.tokenizer = None, None

    def load_model(self):
        if self.model is None or self.tokenizer is None:
            print(f"\n>>> Base 양자화 LLM 모델({self.model_name})을 로딩합니다...")
            
            # Base 양자화 모델 로딩 설정
            model_kwargs = {
                "device_map": "auto",
                "trust_remote_code": True,
                "low_cpu_mem_usage": settings.LOW_CPU_MEM_USAGE
            }
            
            # 양자화 설정에 따라 dtype 결정
            if settings.USE_QUANTIZATION:
                if settings.QUANTIZATION_BITS == 16:
                    model_kwargs["torch_dtype"] = torch.bfloat16
                    print("🔧 Base 양자화 모드: 16비트 정밀도 (bfloat16)")
                elif settings.QUANTIZATION_BITS == 8:
                    model_kwargs["load_in_8bit"] = True
                    print("🔧 Base 양자화 모드: 8비트 양자화")
                elif settings.QUANTIZATION_BITS == 4:
                    # 4비트 양자화 설정 (최대 압축)
                    model_kwargs["load_in_4bit"] = True
                    model_kwargs["bnb_4bit_compute_dtype"] = getattr(torch, settings.BNB_4BIT_COMPUTE_DTYPE)
                    model_kwargs["bnb_4bit_use_double_quant"] = settings.BNB_4BIT_USE_DOUBLE_QUANT
                    model_kwargs["bnb_4bit_quant_type"] = settings.BNB_4BIT_QUANT_TYPE
                    print("🔧 Base 양자화 모드: 4비트 양자화 (최대 압축, 메모리 ~87% 절약)")
                    print(f"   - 계산 정밀도: {settings.BNB_4BIT_COMPUTE_DTYPE}")
                    print(f"   - 이중 양자화: {settings.BNB_4BIT_USE_DOUBLE_QUANT}")
                    print(f"   - 양자화 타입: {settings.BNB_4BIT_QUANT_TYPE}")
            else:
                model_kwargs["torch_dtype"] = torch.float16
                print("🔧 일반 모드: 16비트 정밀도 (float16)")
            
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                **model_kwargs
            )
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name, 
                padding_side='left',
                trust_remote_code=True
            )
            self.tokenizer.pad_token = self.tokenizer.eos_token
            print("✅ Base 양자화 LLM 모델 로딩 완료.")

    def generate(self, prompt: str) -> str:
        if not self.model or not self.tokenizer:
            raise RuntimeError("LLM 모델이 로드되지 않았습니다.")
        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")
        if 'token_type_ids' in inputs:
            del inputs['token_type_ids']
        output_tokens = self.model.generate(
            **inputs, max_new_tokens=512,
            eos_token_id=self.tokenizer.eos_token_id,
            do_sample=True, temperature=0.1, top_p=0.9
        )
        return self.tokenizer.decode(output_tokens[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True).strip()


class QuantitativeEvaluator:
    """scoring_rules.json을 기반으로 정량 평가를 수행하는 엔진"""
    def __init__(self, rules_path, universities_kb_path, certifications_kb_path, similarity_evaluator):
        self.rules_data = load_json_file(rules_path)
        self.uni_kb = {uni['name']: uni['group'] for uni in load_json_file(universities_kb_path)}
        self.cert_type_map = self._build_cert_type_map(load_json_file(certifications_kb_path))
        self.similarity_evaluator = similarity_evaluator
        self.target_job_role = self.rules_data.get('common_rules', {}).get('job_role', 'Software Engineer')
        if not self.rules_data:
            raise ValueError("Scoring rules 파일을 로드할 수 없습니다.")

    def _build_cert_type_map(self, cert_data):
        type_map = {}
        for cert in cert_data:
            cert_type = cert.get('type')
            if cert_type:
                type_map[cert['name'].lower()] = cert_type  
                for alias in cert.get('aliases', []):
                    type_map[alias.lower()] = cert_type
        return type_map

    def _find_answer_item(self, rule_name, applicant_data):
        """Name 기반으로 정확하게 답변 항목을 찾습니다."""
        for item in applicant_data.get('resumeItemAnswers', []):
            if item.get('resumeItemName') == rule_name:
                return item
        return {}

    def _evaluate_category(self, rule, applicant_answer_item):
        applicant_category = applicant_answer_item.get('selectedCategory')
        applicant_content = applicant_answer_item.get('resumeContent', '')

        if not applicant_category:
            if '학력' in rule.get('name', ''):
                uni_name_match = re.search(r'(\w+대학교|\w+대)', applicant_content)
                uni_name = uni_name_match.group(1) if uni_name_match else None
                if uni_name and uni_name in self.uni_kb:
                    applicant_category = self.uni_kb[uni_name]
                else:
                    return 0
            else:
                for criterion in rule.get('criteria', []):
                    if criterion.get('description', '').strip() in applicant_content:
                        return criterion.get('score_per_grade', 0)
                return 0

        if applicant_category:
            for criterion in rule.get('criteria', []):
                criterion_desc = criterion.get('description', '')
                if applicant_category == criterion_desc or applicant_category in criterion_desc.split('·'):
                    return criterion.get('score_per_grade', 0)

        return 0

    def _evaluate_numeric_range(self, rule, applicant_answer_item):
        applicant_content = applicant_answer_item.get('resumeContent', '')
        gpa_match = re.search(r'(이공|인문)\s*(\d+(?:\.\d+)?)', applicant_content)
        if gpa_match:
            applicant_major, applicant_score = gpa_match.groups()
            applicant_score = float(applicant_score)
            for criterion in rule.get('criteria', []):
                desc = criterion.get('description', '')
                major_rule_match = re.search(rf'{applicant_major}\s*([<≥>≤])\s*(\d+(?:\.\d+)?)', desc)
                if major_rule_match:
                    operator, threshold = major_rule_match.groups()
                    threshold = float(threshold)
                    if (operator == '≥' and applicant_score >= threshold) or \
                       (operator == '<' and applicant_score < threshold):
                        return criterion.get('score_per_grade', 0)
            return 0
        return 0

    def _evaluate_hours_range(self, rule, applicant_answer_item):
        applicant_content = applicant_answer_item.get('resumeContent', '')
        simple_numeric_match = re.search(r'(\d+)', applicant_content)
        if not simple_numeric_match: return 0
        value = int(simple_numeric_match.group(1))

        sorted_criteria = sorted(rule.get('criteria', []), key=lambda x: int(x.get('description', 0)), reverse=True)
        for criterion in sorted_criteria:
            if value >= int(criterion.get('description', 0)):
                return criterion.get('score_per_grade', 0)
        return 0

    def _evaluate_duration_based(self, rule, applicant_answer_item):
        applicant_content = applicant_answer_item.get('resumeContent', '').strip()
        if not applicant_content: return 0
        duration_match = re.search(r'(\d+)\s*개월', applicant_content)
        if not duration_match: return 0
        months = int(duration_match.group(1))
        sorted_criteria = sorted(rule.get('criteria', []), key=lambda x: int(x.get('description', 0)), reverse=True)
        for criterion in sorted_criteria:
            if months >= int(criterion.get('description', 0)):
                return criterion.get('score_per_grade', 0)
        return 0

    def _evaluate_rule_based_count(self, rule, applicant_answer_item):
        applicant_content = applicant_answer_item.get('resumeContent', '').lower().strip()
        applicant_certs = [c.strip() for c in applicant_content.split(',')] if applicant_content else []
        total_score = 0

        for sub_rule in rule.get('criteria', []):
            rule_cert_type = sub_rule.get('description', '')
            points_per_item = sub_rule.get('score_per_grade', 0)  # 기본값 0으로 설정
            max_items = sub_rule.get('max_items', float('inf'))

            count = 0
            for cert_name in applicant_certs:
                applicant_cert_type = self.cert_type_map.get(cert_name)
                if applicant_cert_type and applicant_cert_type in rule_cert_type:
                    count += 1

            score_for_rule = min(count, max_items) * points_per_item
            total_score += score_for_rule

        return min(total_score, rule.get('score_weight', total_score))

    def _evaluate_text_based(self, rule, applicant_answer_item):
        """TEXT, NUMBER, DATE, FILE, SELECT 타입에 대한 기본 평가"""
        applicant_content = applicant_answer_item.get('resumeContent', '').strip()
        if not applicant_content:
            return 0
        
        # 기본적으로 내용이 있으면 최소 점수, 평가 기준과 매칭되면 더 높은 점수
        for criterion in rule.get('criteria', []):
            criterion_desc = criterion.get('description', '').strip()
            if criterion_desc and criterion_desc.lower() in applicant_content.lower():
                score = criterion.get('score_per_grade', 0)
                print(f"[DEBUG] 텍스트 매칭 성공: '{criterion_desc}' in '{applicant_content}' -> {score}점")
                return score
        
        # 매칭되는 기준이 없으면 기본 점수 (내용이 있기만 하면)
        default_score = rule.get('criteria', [{}])[0].get('score_per_grade', 0) if rule.get('criteria') else 0
        print(f"[DEBUG] 텍스트 기본 점수: '{applicant_content}' -> {default_score}점")
        return default_score

    def _evaluate_score_range(self, rule, applicant_answer_item):
        applicant_content = applicant_answer_item.get('resumeContent', '').strip().lower()
        if not applicant_content:
            return 0

        # 지원자 입력을 개별 토큰으로 분리 (예: "opic ih" → ["opic", "ih"])
        applicant_tokens = applicant_content.split()

        for criterion in rule.get('criteria', []):
            criterion_desc = criterion.get('description', '').lower()
            criterion_tokens = criterion_desc.split()

            # 지원자의 모든 토큰이 기준에 포함되어 있는지 확인
            if all(token in criterion_tokens for token in applicant_tokens):
                return criterion.get('score_per_grade', 0)

        return 0

    def _extract_career_info(self, career_content):
        """경력 정보에서 직무명과 기간 추출"""
        parts = [part.strip() for part in career_content.split(',')]
    
        company = parts[0] if len(parts) > 0 else ""
        job_title = parts[1] if len(parts) > 1 else ""
        duration_text = parts[2] if len(parts) > 2 else ""
    
        # 기간 추출 (14개월 → 14)
        duration_match = re.search(r'(\d+)', duration_text)
        duration_months = int(duration_match.group(1)) if duration_match else 0
    
        return {
            "company": company,
            "job_title": job_title,
            "duration_months": duration_months
        }

    def _calculate_job_similarity(self, applicant_job, target_job):
        """두 직무명 간의 코사인 유사도 계산"""
        if not applicant_job or not target_job:
            return 0.0
        
        # 임베딩 모델로 벡터화
        applicant_embedding = self.embedding_model.encode([applicant_job])
        target_embedding = self.embedding_model.encode([target_job])
    
        # 코사인 유사도 계산
        similarity = cosine_similarity(applicant_embedding, target_embedding)[0][0]
        return similarity

    def _evaluate_career_similarity_based(self, rule, applicant_answer_item):
        """직무 유사도를 고려한 경력 평가"""
        career_content = applicant_answer_item.get("resumeContent", "").strip()
        if not career_content:
            return 0
    
        career_info = self._extract_career_info(career_content)
    
        # 직무 유사도 계산
        target_job_role = rule.get("target_job_role", "")
        similarity = self._calculate_job_similarity(
            career_info["job_title"], 
            target_job_role
        )
    
        print(f"직무 유사도: {career_info['job_title']} vs {target_job_role} = {similarity:.3f}")
    
        # 유사도 임계값 확인
        similarity_threshold = rule.get("similarity_threshold", 0.7)
        if similarity < similarity_threshold:
            print(f"유사도 {similarity:.3f} < 임계값 {similarity_threshold}, 감점 적용")
            return min(8, self._calculate_duration_score(career_info["duration_months"], rule.get("criteria", [])) * 0.5)
    
        # 유사 직무인 경우 기간에 따라 정상 점수 부여
        duration_score = self._calculate_duration_score(career_info["duration_months"], rule.get("criteria", []))
        print(f"유사직무 확인, 기간 {career_info['duration_months']}개월로 {duration_score}점 부여")
    
        return duration_score

    def _calculate_duration_score(self, duration_months, criteria):
        """기간에 따른 점수 계산"""
        sorted_criteria = sorted(criteria, key=lambda x: int(x.get("description", "0")), reverse=True)
        for criterion in sorted_criteria:
            if duration_months >= int(criterion.get("description", "0")):
                return criterion.get("score_per_grade", 0)
        return 0

    def evaluate(self, applicant_data):
        """[오류 수정] Name을 key로 사용하여 점수를 반환"""
        results_by_name = {}
        
        # 디버깅: 입력 데이터 확인
        print(f"[DEBUG] QuantitativeEvaluator 입력 데이터:")
        print(f"  - resumeItemAnswers 수: {len(applicant_data.get('resumeItemAnswers', []))}")
        for item in applicant_data.get('resumeItemAnswers', []):
            print(f"    * {item.get('resumeItemName')} (ID: {item.get('resumeItemId')})")
        
        print(f"  - rules_data resume_items 수: {len(self.rules_data.get('resume_items', []))}")
        for rule in self.rules_data.get('resume_items', []):
            print(f"    * {rule.get('name')} (타입: {rule.get('type')})")
        
        for rule in self.rules_data.get('resume_items', []):
            rule_name, item_type = rule['name'], rule['type']
            answer_item = self._find_answer_item(rule_name, applicant_data)
            score = 0
            
            print(f"[DEBUG] 규칙 '{rule_name}' 처리:")
            print(f"  - 매칭된 답변: {answer_item}")
            
            if answer_item:
                if item_type == 'CATEGORY': 
                    score = self._evaluate_category(rule, answer_item)
                elif item_type == 'NUMERIC_RANGE': 
                    score = self._evaluate_numeric_range(rule, answer_item)
                elif item_type == 'HOURS_RANGE': 
                    score = self._evaluate_hours_range(rule, answer_item)
                elif item_type == 'DURATION_BASED': 
                    score = self._evaluate_duration_based(rule, answer_item)
                elif item_type == 'RULE_BASED_COUNT': 
                    score = self._evaluate_rule_based_count(rule, answer_item)
                elif item_type == 'SCORE_RANGE': 
                    score = self._evaluate_score_range(rule, answer_item)
                elif item_type in ['TEXT', 'NUMBER', 'DATE', 'FILE', 'SELECT']:
                    # 기본 텍스트 기반 평가 (내용 매칭)
                    score = self._evaluate_text_based(rule, answer_item)
                else:
                    print(f"  - 알 수 없는 타입: {item_type} (점수: 0)")
                    score = 0
                print(f"  - 계산된 점수: {score}")
            else:
                print(f"  - 매칭된 답변 없음 (점수: 0)")
                
            results_by_name[rule_name] = score
        
        print(f"[DEBUG] 최종 정량 평가 결과: {results_by_name}")
        return results_by_name


class QualitativeEvaluator:
    """RAG와 LLM을 사용하여 정성 평가 및 종합 분석을 수행하는 엔진"""
    def __init__(self, rag_data_path, db_path, collection_name, llm_manager):
        self.rag_criteria = self._load_rag_criteria(rag_data_path)
        self.llm_manager = llm_manager
        self.db_client = chromadb.PersistentClient(path=db_path)
        self.collection = self.db_client.get_collection(
            name=collection_name,
            embedding_function=chromadb.utils.embedding_functions.SentenceTransformerEmbeddingFunction(model_name=settings.EMBEDDING_MODEL)
        )

    def _map_question_id(self, cover_letter_question_id):
        """
        Spring Boot의 coverLetterQuestionId를 ChromaDB의 question_id(1,2)로 매핑
        P1과 동일한 매핑 로직 사용
        """
        mapped_id = cover_letter_question_id % 2
        if mapped_id == 0:
            mapped_id = 2
        return mapped_id

    def _load_rag_criteria(self, rag_data_path):
        all_rag_data = load_json_file(rag_data_path)
        criteria = {}
        
        # 디버깅 로그 추가
        print(f"[DEBUG] RAG 기준 로딩 시작: {rag_data_path}")
        if not all_rag_data:
            print(f"[ERROR] RAG 데이터 파일이 비어있거나 로드 실패: {rag_data_path}")
            return {}
        
        print(f"[DEBUG] RAG 데이터 로드 성공: {len(all_rag_data)}개 항목")
        
        criterion_count = 0
        for i, item in enumerate(all_rag_data):
            print(f"[DEBUG] Item {i}: type={item.get('type')}, question_id={item.get('question_id')}")
            
            # criterion 타입인 경우만 처리 (example_sentence는 제외)
            if item.get("type") == "criterion":
                q_id = item["question_id"]
                criterion_name = item['content']['name']
                packet_id = item.get("packet_id", f"Q{q_id}_{criterion_name}")
                print(f"[DEBUG] 기준 발견 (criterion): Q{q_id} - {criterion_name} (packet_id: {packet_id})")
                
                if q_id not in criteria:
                    criteria[q_id] = []
                
                # packet_id를 기준으로 중복 체크 (더 정확한 중복 제거)
                existing_packet_ids = [c.get('id', '') for c in criteria[q_id]]
                if packet_id not in existing_packet_ids:
                    # packet_id를 id로 추가
                    criterion_content = item["content"].copy()
                    criterion_content["id"] = packet_id
                    criteria[q_id].append(criterion_content)
                    criterion_count += 1
                    print(f"[DEBUG] 평가 기준 추가: Q{q_id} - {criterion_name} (총 {criterion_count}개)")
                else:
                    print(f"[DEBUG] 중복 기준 건너뜀: Q{q_id} - {criterion_name} (packet_id: {packet_id})")
        
        print(f"[DEBUG] 최종 criteria 구조:")
        for q_id, criteria_list in criteria.items():
            print(f"  Q{q_id}: {len(criteria_list)}개 기준")
            for criterion in criteria_list:
                print(f"    - {criterion.get('name', 'Unknown')}")
        
        print(f"[DEBUG] 총 {len(criteria)}개의 평가 기준 로드 완료")
        print(f"[DEBUG] question_id별 기준 수: {[(q_id, len(criteria[q_id])) for q_id in criteria.keys()]}")
        
        return criteria

    def _search_examples(self, question_id, applicant_answer):
        results = self.collection.query(
            query_texts=[applicant_answer], n_results=3,
            where={"question_id": question_id}
        )
        return results['documents'][0] if (results and results['documents']) else []

    def _create_prompt(self, prompt_type, **kwargs):
        if prompt_type == "item_evaluation":
            excellent_desc = next((d['description'] for d in kwargs['criterion']['details'] if d['grade'] == 'EXCELLENT'), "N/A")
            return f"""### 지시:
당신은 신입 BE 개발자 채용 전문가입니다. [지원자 답변]을 [평가 기준]과 [유사 예시]를 참고하여 평가하고, 결과를 반드시 JSON 형식으로만 출력하세요.

### 평가 대상:
[지원자 답변]
{kwargs['applicant_answer']}

### 평가 기준: {kwargs['criterion']['name']}
- **최고점(EXCELLENT)**: {excellent_desc}

### 참고 자료:
[유사 예시]
{kwargs['examples_text']}

### 출력 형식 (반드시 이 JSON 형식 준수, 다른 설명 절대 추가 금지):
{{
  "evaluatedContent": "[지원자 답변]에서 [평가 기준]과 가장 관련 깊은 핵심 문장 1개를 그대로 추출. 없다면 '없음'으로 응답.",
  "grade": "평가 결과를 '긍정', '부정', '중립' 중 하나로 평가.",
  "evaluationReason": "평가 근거를 [평가 기준]과 연관 지어 1문장으로 서술."
}}

### 출력:
"""
        elif prompt_type == "question_summary":
            return f"""### 지시:
당신은 채용 전문가입니다. 아래 [문항 답변]의 핵심 내용을 요약하여 [출력 형식]에 맞춰 JSON으로만 출력하세요.

### 평가 대상:
[문항 답변]
{kwargs['answer_content']}

### 출력 형식 (반드시 이 JSON 형식 준수, 다른 설명 절대 추가 금지):
{{
  "keywords": ["답변의 핵심 키워드를 5개 추출하여 리스트 형태로 작성"],
  "summary": "답변 내용을 1~2 문장으로 요약."
}}

### 출력:
"""
        elif prompt_type == "overall_analysis":
            return f"""### 지시:
당신은 최고 수준의 채용 전문가입니다. 아래 [지원자 종합 정보]를 바탕으로 지원자를 다각도로 분석하고, 결과를 반드시 JSON 형식으로만 출력하세요.

### 분석 대상:
[지원자 종합 정보]
{kwargs['total_report']}

### 출력 형식 (반드시 이 JSON 형식 준수, 다른 설명 절대 추가 금지):
{{
  "overallEvaluation": "지원자에 대한 종합적인 평가를 1문장으로 요약.",
  "strengths": ["지원자의 강점을 3가지 항목으로 나누어 리스트 형태로 작성"],
  "improvements": ["지원자의 개선점을 2가지 항목으로 나누어 리스트 형태로 작성"],
  "aiRecommendation": "종합적인 판단에 따라 '합격 권장' 또는 '신중한 검토 필요' 또는 '탈락 권장' 중 하나로 결론.",
  "aiReliability": "현재 분석 결과에 대한 AI의 신뢰도를 0.0에서 1.0 사이의 소수점 두 자리 숫자로 표현. (예: 0.87)"
}}

### 출력:
"""

    def _call_llm(self, prompt):
        raw_response = self.llm_manager.generate(prompt)
        try:
            # JSON 객체가 시작하는 첫 '{'를 찾아 그 이후의 모든 내용을 파싱
            json_part = raw_response[raw_response.find('{'):]
            return json.loads(json_part)
        except (json.JSONDecodeError, AttributeError):
            return None # 파싱 실패 시 None 반환

    def evaluate(self, applicant_data, quant_results): # [오류 해결] quant_results 인자 추가
        self.llm_manager.load_model()
        cover_letter_evals = []
        answers = applicant_data.get('coverLetterQuestionAnswers', [])
        
        # 디버깅: 정성 평가 입력 데이터 확인
        print(f"[DEBUG] QualitativeEvaluator 입력 데이터:")
        print(f"  - coverLetterQuestionAnswers 수: {len(answers)}")
        for answer in answers:
            print(f"    * Q{answer.get('coverLetterQuestionId')}: {answer.get('answerContent', '')[:50]}...")
        
        print(f"  - rag_criteria 키들: {list(self.rag_criteria.keys())}")
        
        for answer_item in answers:
            original_q_id = answer_item['coverLetterQuestionId']  # 원본 ID (35, 36 등)
            mapped_q_id = self._map_question_id(original_q_id)    # 매핑된 ID (1, 2)
            answer_content = answer_item['answerContent']
            answer_evaluations = []
            
            # 매핑된 question_id로 기준 찾기
            criteria_for_question = self.rag_criteria.get(mapped_q_id, [])
            
            print(f"[DEBUG] Q{original_q_id} -> Q{mapped_q_id} 정성 평가:")
            print(f"  - 찾은 평가 기준 수: {len(criteria_for_question)}")
            
            # 매핑된 question_id로 유사 예시 검색
            similar_examples = self._search_examples(mapped_q_id, answer_content)
            examples_text = "\n".join([f"- {ex}" for ex in similar_examples]) if similar_examples else "없음"
            
            for criterion in tqdm(criteria_for_question, desc=f"  - Q{original_q_id} 정성 평가 중"):
                prompt = self._create_prompt("item_evaluation", applicant_answer=answer_content, criterion=criterion, examples_text=examples_text)
                eval_result = self._call_llm(prompt)
                if eval_result:
                    eval_result["evaluationCriteriaName"] = criterion.get('name', 'Unknown')
                    answer_evaluations.append(eval_result)
            
            summary_prompt = self._create_prompt("question_summary", answer_content=answer_content)
            summary_result = self._call_llm(summary_prompt) or {"keywords": [], "summary": "요약 생성 실패"}
            cover_letter_evals.append({
                "coverLetterQuestionId": original_q_id,  # 원본 ID 유지
                "keywords": summary_result.get('keywords', []),
                "summary": summary_result.get('summary', ''),
                "answerEvaluations": answer_evaluations
            })
        temp_report = {"정량 평가": quant_results, "정성 평가": cover_letter_evals}
        overall_prompt = self._create_prompt("overall_analysis", total_report=json.dumps(temp_report, ensure_ascii=False, indent=2))
        overall_analysis = self._call_llm(overall_prompt) or {
            "overallEvaluation": "분석 실패", "strengths": [], "improvements": [],
            "aiRecommendation": "판단 불가", "aiReliability": 0.0
        }
        return cover_letter_evals, overall_analysis


def run_p2_pipeline(applicant_data: dict, llm_manager: LLMManager, similarity_evaluator: SimilarityEvaluator):
    """
    P2 파이프라인 전체를 실행하고 최종 평가 리포트를 반환하는 메인 함수
    """
    print(f"--- 🧠 1. 정량 평가 시작: {applicant_data.get('applicantName')} ---")
    quant_evaluator = QuantitativeEvaluator(
        rules_path=settings.SCORING_RULES_FILE,
        universities_kb_path=settings.UNIVERSITIES_KB_FILE,
        certifications_kb_path=settings.CERTIFICATIONS_KB_FILE,
        similarity_evaluator=similarity_evaluator
    )
    quant_scores_by_name = quant_evaluator.evaluate(applicant_data)

    print(f"--- 🖋️ 2. 정성 평가 및 종합 분석 시작 ---")
    qual_evaluator = QualitativeEvaluator(
        rag_data_path=settings.RAG_DATA_FILE,
        db_path=settings.DB_PATH,
        collection_name=settings.COLLECTION_NAME,
        llm_manager=llm_manager # 공유된 LLM 매니저 사용
    )
    
    cover_letter_evals, overall_analysis = qual_evaluator.evaluate(
        applicant_data, {"scores_by_name": quant_scores_by_name}
    )

    print(f"--- 📝 3. 최종 평가 리포트 생성 ---")
    resume_evaluations = []
    
    # 디버깅: 점수 매핑 과정 확인
    print(f"[DEBUG] 최종 리포트 생성 - 점수 매핑 과정:")
    print(f"  - quant_scores_by_name: {quant_scores_by_name}")
    
    for answer in applicant_data.get('resumeItemAnswers', []):
        item_name = answer['resumeItemName']
        content = answer.get('resumeContent', '') or answer.get('selectedCategory', '')
        score = quant_scores_by_name.get(item_name, 0)
        
        print(f"  - {item_name}: quant_scores_by_name에서 점수 조회 -> {score}")
        
        resume_evaluations.append({
            "resumeItemId": answer['resumeItemId'],
            "resumeItemName": item_name,
            "resumeContent": content,
            "score": score
        })
    
    final_report = {
        "applicantId": applicant_data.get('applicantId', 0),  # 기본값을 0으로 설정
        "applicantName": applicant_data.get('applicantName', ''),
        "applicantEmail": applicant_data.get('applicantEmail', ''),
        "applicationId": applicant_data.get('applicationId', 0),  # 기본값을 0으로 설정
        "jobPostingId": applicant_data.get('jobPostingId', 0),  # 기본값을 0으로 설정
        "resumeEvaluations": resume_evaluations,
        "coverLetterQuestionEvaluations": cover_letter_evals,
        "overallAnalysis": overall_analysis
    }
    
    print(final_report)
    
    return final_report