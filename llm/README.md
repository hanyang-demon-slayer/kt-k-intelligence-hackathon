# LLM Service

Python FastAPI 기반의 AI 서비스로, 채용 지원서의 자동 평가 및 분석을 담당합니다.

## 🚀 기술 스택

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI/ML**: OpenAI API, LangChain
- **Data Processing**: Pandas, NumPy
- **HTTP Client**: httpx
- **Validation**: Pydantic

## 📦 의존성

주요 의존성은 `requirements.txt`에서 관리됩니다:

```txt
fastapi==0.104.1
uvicorn==0.24.0
openai==1.3.0
langchain==0.0.340
pandas==2.1.3
numpy==1.25.2
pydantic==2.5.0
httpx==0.25.2
python-multipart==0.0.6
```

## 🔧 환경 설정

### 개발 환경
```bash
# Python 가상환경 생성
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는
venv\Scripts\activate     # Windows

# 의존성 설치
pip install -r requirements.txt
```

### 환경 변수 설정
```bash
# .env 파일 생성
OPENAI_API_KEY=your_openai_api_key
BACKEND_API_URL=http://localhost:8080
```

## 🏃‍♂️ 실행 방법

### 개발 서버 실행
```bash
# 직접 실행
python main.py

# 또는 uvicorn 사용
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 프로덕션 서버 실행
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📊 API 엔드포인트

### 주요 API
- `POST /evaluate` - 지원서 평가 실행
- `GET /health` - 서비스 상태 확인
- `GET /docs` - API 문서 (Swagger UI)

### API 문서
서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- http://localhost:8000/docs

## 🧠 AI 모델 및 파이프라인

### 평가 파이프라인
1. **P1 Builder**: 평가 기준 및 프롬프트 생성
2. **P2 Evaluator**: 실제 지원서 평가 수행

### 사용 모델
- **OpenAI GPT-4**: 메인 평가 모델
- **LangChain**: 프롬프트 관리 및 체인 구성

## 📁 프로젝트 구조

```
llm/
├── main.py                 # FastAPI 애플리케이션 진입점
├── schemas.py              # Pydantic 스키마 정의
├── dependencies.py         # 의존성 주입
├── core/
│   └── config.py          # 설정 관리
├── pipelines/
│   ├── p1_builder.py      # 평가 기준 빌더
│   └── p2_evaluator.py    # 평가 실행기
└── data/
    ├── examples.json      # 예시 데이터
    ├── kb/               # 지식 베이스
    └── assets/           # 정적 자산
```

## 🔧 설정 관리

### config.py
```python
class Settings:
    openai_api_key: str
    backend_api_url: str
    max_evaluation_time: int = 300
    model_name: str = "gpt-4"
```

## 🧪 테스트

### 테스트 실행
```bash
# 단위 테스트
python -m pytest tests/

# 통합 테스트
python -m pytest tests/integration/

# 테스트 커버리지
python -m pytest --cov=. tests/
```

### 테스트 파일 구조
```
tests/
├── unit/
│   ├── test_p1_builder.py
│   └── test_p2_evaluator.py
├── integration/
│   └── test_api.py
└── fixtures/
    └── sample_data.json
```

## 📈 성능 최적화

### 비동기 처리
- FastAPI의 async/await 활용
- 비동기 HTTP 클라이언트 사용

### 캐싱
- Redis 캐싱 (향후 구현 예정)
- 평가 결과 캐싱

### 모니터링
- 로깅 설정
- 성능 메트릭 수집

## 🔒 보안

### API 키 관리
- 환경 변수를 통한 API 키 관리
- 키 로테이션 지원

### 입력 검증
- Pydantic을 통한 데이터 검증
- SQL 인젝션 방지

## 🚀 배포

### Docker를 이용한 배포
```bash
# Docker 이미지 빌드
docker build -t kt-hackathon-llm .

# 컨테이너 실행
docker run -p 8000:8000 kt-hackathon-llm
```

### Docker Compose
```yaml
version: '3.8'
services:
  llm:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./data:/app/data
```

## 📊 모니터링 및 로깅

### 로깅 설정
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

### 헬스체크
```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}
```

## 🔧 개발 도구

### 코드 품질
- Black - 코드 포매팅
- Flake8 - 코드 린팅
- MyPy - 타입 체킹

### 개발 환경
- Jupyter Notebook - 데이터 분석
- VS Code - IDE
- Python Debugger (pdb)
