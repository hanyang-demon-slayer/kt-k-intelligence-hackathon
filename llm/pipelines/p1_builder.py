# llm/pipelines/p1_builder.py

import json
import torch
import os
import gc
import re
from tqdm import tqdm
from transformers import AutoTokenizer, AutoModelForCausalLM
import chromadb
# core/config.py에서 설정값을 가져오기 위한 import
from core.config import settings

# --- P1용 헬퍼 함수 ---
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

# --- P1 파이프라인의 구성 요소들 ---

class LLMManager:
    """
    P1 파이프라인에서 RAG 데이터 생성을 위해 사용하는 LLM 관리 클래스
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(LLMManager, cls).__new__(cls)
            cls._instance.model, cls._instance.tokenizer = None, None
        return cls._instance
    
    def __init__(self, model_name):
        self.model_name = model_name

    def load_model(self):
        if self.model is None or self.tokenizer is None:
            print(f">>> P1 Base 양자화 LLM 모델({self.model_name})을 로딩합니다.")
            
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
                    print("🔧 P1 Base 양자화 모드: 16비트 정밀도 (bfloat16)")
                elif settings.QUANTIZATION_BITS == 8:
                    model_kwargs["load_in_8bit"] = True
                    print("🔧 P1 Base 양자화 모드: 8비트 양자화")
                elif settings.QUANTIZATION_BITS == 4:
                    # 4비트 양자화 설정 (최대 압축)
                    model_kwargs["load_in_4bit"] = True
                    model_kwargs["bnb_4bit_compute_dtype"] = getattr(torch, settings.BNB_4BIT_COMPUTE_DTYPE)
                    model_kwargs["bnb_4bit_use_double_quant"] = settings.BNB_4BIT_USE_DOUBLE_QUANT
                    model_kwargs["bnb_4bit_quant_type"] = settings.BNB_4BIT_QUANT_TYPE
                    print("🔧 P1 Base 양자화 모드: 4비트 양자화 (최대 압축, 메모리 ~87% 절약)")
                    print(f"   - 계산 정밀도: {settings.BNB_4BIT_COMPUTE_DTYPE}")
                    print(f"   - 이중 양자화: {settings.BNB_4BIT_USE_DOUBLE_QUANT}")
                    print(f"   - 양자화 타입: {settings.BNB_4BIT_QUANT_TYPE}")
            else:
                model_kwargs["torch_dtype"] = torch.float16
                print("🔧 P1 일반 모드: 16비트 정밀도 (float16)")
            
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
            print("✅ P1 Base 양자화 LLM 모델 로딩 완료.")
    
    def refine_with_original(self, generated_clue: str, original_text: str) -> str:
        """LLM의 답변(단서)을 원본 텍스트와 대조하여 완벽한 문장을 추출합니다."""
        clue = re.sub(r'.*?다음과 같습니다[:\s]*', '', generated_clue, flags=re.DOTALL)
        clue = re.sub(r'["“]', '', clue).strip()
        original_sentences = re.split(r'(?<=[.!?])\s+', original_text)
        key_phrases = clue.split()
        if len(key_phrases) < 3: return ""
        for sentence in original_sentences:
            start_phrase = ' '.join(key_phrases[:5])
            if start_phrase in sentence:
                return sentence.strip()
        best_match_sentence, highest_match_score = "", 0
        for sentence in original_sentences:
            match_count = sum(1 for word in key_phrases if word in sentence)
            score = match_count / len(key_phrases)
            if score > highest_match_score and score > 0.5:
                highest_match_score = score
                best_match_sentence = sentence.strip()
        return best_match_sentence

    def generate_batch(self, prompts: list[str]) -> list[str]:
        """여러 프롬프트를 배치로 처리하여 '단서'가 될 문장들을 생성합니다."""
        if not self.model or not self.tokenizer: raise RuntimeError("LLM 모델이 로드되지 않았습니다.")
        inputs = self.tokenizer(prompts, padding=True, return_tensors="pt", truncation=True, max_length=1024).to("cuda")
        if 'token_type_ids' in inputs: del inputs['token_type_ids']
        input_token_len = inputs["input_ids"].shape[1]
        output_tokens = self.model.generate(
            **inputs, max_new_tokens=150, eos_token_id=self.tokenizer.eos_token_id,
            do_sample=True, temperature=0.1, top_p=0.9
        )
        return [
            self.tokenizer.decode(output[input_token_len:], skip_special_tokens=True).strip()
            for output in output_tokens
        ]


class P1_AssetBuilder:
    """
    평가 기준과 예시 데이터를 바탕으로 평가 자산(scoring_rules, rag_data)을 생성하는 클래스
    """
    def __init__(self, criteria_data: dict, examples_data: dict, llm_manager: LLMManager):
        self.eval_criteria = criteria_data
        self.examples = examples_data
        self.llm_manager = llm_manager
        self.llm_call_stats = {}

    def generate_scoring_rules(self, output_path: str):
        """정량 평가 규칙(scoring_rules.json)을 생성합니다."""
        print("[P1] 정량 평가 규칙 생성을 시작합니다...")
        scoring_rules = {
            "common_rules": self.eval_criteria.get("commonRules", {}),
            "resume_items": self.eval_criteria.get("resumeItems", [])  # camelCase로 변경
        }
        
        # 'jobRole'이 있으면, 경력 평가 규칙을 '유사도 기반'으로 동적 변경
        job_role = scoring_rules.get("common_rules", {}).get("jobRole")  # camelCase로 변경
        if job_role:
            for item in scoring_rules.get("resume_items", []):
                if item.get("name") == "경력":
                    print(f"  - 채용 직무('{job_role}')가 확인되어, 경력 평가 방식을 '직무 유사도 기반'으로 설정합니다.")
                    item["type"] = "CAREER_SIMILARITY_BASED"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(scoring_rules, f, ensure_ascii=False, indent=2)
        print(f"✅ 정량 평가 규칙 생성 완료: {output_path}")

    def _create_extraction_prompt(self, criterion: dict, example_content: str, job_info: dict) -> str:
        criterion_name = criterion['name']
        excellent_desc = next((d['description'] for d in criterion['details'] if d['grade'] == 'EXCELLENT'), "")
        poor_desc = next((d['description'] for d in criterion['details'] if d['grade'] == 'POOR'), "")
        return f"""### 지시:
주어진 [자기소개서 원문]에서 '{criterion_name}' 기준을 가장 잘 나타내는 문장 1개만 원문 그대로 추출하세요.

[채점 가이드]
- 최고점(EXCELLENT) 문장의 특징: {excellent_desc}
- 최저점(POOR) 문장의 특징: {poor_desc}

[추출 규칙]
- 부가 설명, 줄바꿈, 따옴표 없이 오직 추출할 문장만 답변해야 합니다.
- 적합한 문장이 없으면 "추출불가" 라고만 답변해야 합니다.

### 입력:
[자기소개서 원문]
{example_content}

### 출력:
[추출 문장]
"""

    def generate_rag_data(self, output_path: str):
        """RAG에 사용될 데이터(rag_data.json)를 생성합니다."""
        print("[P1] RAG 데이터 생성을 시작합니다...")
        
        # 기존 데이터 로드 (파일이 있으면)
        existing_rag_data = []
        if os.path.exists(output_path):
            try:
                with open(output_path, 'r', encoding='utf-8') as f:
                    existing_rag_data = json.load(f)
                print(f"  - 기존 RAG 데이터 {len(existing_rag_data)}개 로드 완료")
            except Exception as e:
                print(f"  - 기존 데이터 로드 실패: {e}")
                existing_rag_data = []
        
        # 새 데이터 생성
        new_rag_data = []
        BATCH_SIZE=8
        
        print("  - (1/3) 평가 기준(criterion) 데이터를 생성 중...")
        criteria_packets = []
        for q in self.eval_criteria.get("coverLetterQuestions", []):
            # question_id를 1 또는 2로 매핑 (examples.json의 question_id와 맞추기 위해)
            mapped_id = q['id'] % 2
            if mapped_id == 0:
                mapped_id = 2
            
            for c in q.get("criteria", []):
                criteria_packets.append({
                    "packet_id": f"Q{mapped_id}_{c['name']}", 
                    "type": "criterion", 
                    "question_id": mapped_id, 
                    "content": c
                })
        
        # 기존 데이터와 새 데이터 병합
        rag_data = existing_rag_data + criteria_packets
        print(f"  - 평가 기준 {len(criteria_packets)}개 생성 완료 (총 {len(rag_data)}개)")
        print("  - (2/3) LLM에 전달할 프롬프트 작업을 생성합니다...")
        job_info = {"companyName": self.eval_criteria.get("companyName", "회사"), "title": self.eval_criteria.get("title", "신입사원")}  # camelCase로 변경
        tasks_to_process = [
            {"crit_pack": crit_pack, "example": ex, "label": label}
            for crit_pack in criteria_packets
            for ex_group in self.examples if ex_group["question_id"] == crit_pack["question_id"]
            for label, key in [("good", "good_examples"), ("bad", "bad_examples")]
            for ex in ex_group.get(key, [])
        ]
        print(f"  - 총 {len(tasks_to_process)}개의 프롬프트 생성 작업을 확인했습니다.")
        print(f"  - (3/3) 작업을 미니 배치(크기: {BATCH_SIZE})로 나누어 LLM으로 처리합니다...")

        progress_bar = tqdm(range(0, len(tasks_to_process), BATCH_SIZE), desc="  - 전체 진행률")
        for i in progress_bar:
            batch_tasks = tasks_to_process[i:i + BATCH_SIZE]
            prompts = [self._create_extraction_prompt(t["crit_pack"]['content'], t["example"]['content'], job_info) for t in batch_tasks]

            raw_sentences = self.llm_manager.generate_batch(prompts)

            for task, raw_sentence in zip(batch_tasks, raw_sentences):
                original_content = task["example"]["content"]
                # [최종 해결책] 원본 대조를 통해 최종 문장 정제
                final_sentence = self.llm_manager.refine_with_original(raw_sentence, original_content)

                criterion_name = task["crit_pack"]["content"]["name"]
                log_msg = f"  [실시간] 기준: {criterion_name:<10s} | 예시: {task['example']['id']:<12s} -> \"{final_sentence[:40]}...\""
                progress_bar.write(log_msg)

                self.llm_call_stats.setdefault(criterion_name, {'success': 0, 'fail': 0})
                if final_sentence and "추출불가" not in final_sentence:
                    rag_data.append({
                        "packet_id": f"EX_{task['example']['id']}_{criterion_name}", "type": "example_sentence", "question_id": task["crit_pack"]["question_id"],
                        "content": {"label": task["label"], "linked_criterion": criterion_name, "extracted_sentence": final_sentence}
                    })
                    self.llm_call_stats[criterion_name]['success'] += 1
                else:
                    self.llm_call_stats[criterion_name]['fail'] += 1

            gc.collect()
            torch.cuda.empty_cache()

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(rag_data, f, ensure_ascii=False, indent=2)
        print(f"✅ RAG 데이터 생성 완료: {output_path} (총 {len(rag_data)}개 항목)")


def upload_rag_data_to_db(rag_data_path: str):
    """생성된 rag_data.json을 ChromaDB에 업로드하고 임베딩하는 함수"""
    print(f"🚀 ChromaDB에 RAG 데이터 업로드를 시작합니다: {settings.DB_PATH}")
    rag_data = load_json_file(rag_data_path)
    if not rag_data:
        print("⚠️ RAG 데이터 파일이 없어 업로드를 건너뜁니다.")
        return

    client = chromadb.PersistentClient(path=settings.DB_PATH)
    
    # 기존 컬렉션 확인 및 데이터 추가
    try:
        existing_collections = [col.name for col in client.list_collections()]
        if settings.COLLECTION_NAME in existing_collections:
            # 기존 컬렉션에 데이터 추가
            collection = client.get_collection(name=settings.COLLECTION_NAME)
            print(f"✅ 기존 컬렉션 '{settings.COLLECTION_NAME}'에 데이터 추가")
        else:
            # 새 컬렉션 생성
            collection = client.create_collection(
                name=settings.COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"},
                embedding_function=chromadb.utils.embedding_functions.SentenceTransformerEmbeddingFunction(
                    model_name=settings.EMBEDDING_MODEL
                )
            )
            print(f"✅ 새 컬렉션 '{settings.COLLECTION_NAME}' 생성 완료")
    except Exception as e:
        print(f"⚠️ 컬렉션 처리 중 오류 발생: {e}")
        return
    
    # --- 6. 업로드할 데이터 준비 ---
    documents = []
    metadatas = []
    ids = []

    for item in rag_data:
        if item.get("type") == "example_sentence":
            content = item["content"]
            documents.append(content["extracted_sentence"])
            metadatas.append({
                "question_id": item["question_id"],
                "label": content["label"],
                "linked_criterion": content["linked_criterion"]
            })
            ids.append(item["packet_id"])

    # --- 7. 데이터 업로드 실행 ---
    if documents:
        print(f"\n🚀 총 {len(documents)}개의 대표 문장을 ChromaDB에 추가합니다...")
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print("🎉 데이터 추가 및 임베딩 완료!")
        print(f"'{settings.DB_PATH}' 폴더에 DB 파일이 성공적으로 생성되었습니다.")
        print("   (Google Drive 'KT해커톤' 폴더를 확인해보세요.)")
    else:
        print("⚠️ 추가할 대표 문장이 없습니다.")

        print(f"🎉 총 {len(documents)}개의 대표 문장을 ChromaDB에 업로드 및 임베딩 완료!")


# main.py에서 호출할 메인 실행 함수
def run_p1_pipeline(eval_criteria_data: dict, examples_data: dict):
    """P1 파이프라인 전체를 실행하는 오케스트레이션 함수"""
    
    # 1. P1 빌더 실행하여 자산 파일 생성
    llm_manager = LLMManager(model_name=settings.MODEL_NAME)
    llm_manager.load_model()
    
    builder = P1_AssetBuilder(
        criteria_data=eval_criteria_data,
        examples_data=examples_data,
        llm_manager=llm_manager
    )
    builder.generate_scoring_rules(settings.SCORING_RULES_FILE)
    builder.generate_rag_data(settings.RAG_DATA_FILE)
    
    # 2. 생성된 RAG 데이터를 ChromaDB에 업로드
    upload_rag_data_to_db(settings.RAG_DATA_FILE)