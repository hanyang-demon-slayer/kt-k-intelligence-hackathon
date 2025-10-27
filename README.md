# KT K-Intelligence Hackathon Project

## 📋 프로젝트 개요

AI 기반 채용 지원서 자동 평가 시스템을 구현한 풀스택 애플리케이션입니다.

## 🏗️ 아키텍처

```
├── backend/     # Spring Boot 백엔드 서버
├── frontend/    # React + TypeScript 프론트엔드  
├── llm/         # Python FastAPI LLM 서비스
└── docker-compose.yml
```

## 🚀 기술 스택

- **Backend**: Spring Boot 3.x, Java 17, JPA/Hibernate
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **LLM Service**: FastAPI, Python 3.11, OpenAI API
- **Database**: H2 (개발), PostgreSQL (운영)

## 📦 빠른 시작

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-username/kt-k-intelligence-hackathon.git
cd kt-k-intelligence-hackathon
```

### 2. 환경 설정
```bash
cp env.example .env
# .env 파일에서 OPENAI_API_KEY 설정
```

### 3. 전체 서비스 실행
```bash
make start
```

**접속 URL:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- LLM Service: http://localhost:8000
- API 문서: http://localhost:8080/swagger-ui.html

## 🛠️ 주요 명령어

```bash
# 전체 서비스 시작
make start

# 서비스 상태 확인
make status

# 로그 확인
make logs

# 전체 정리
make clean

# 개발 모드 실행
make dev-backend    # Backend만
make dev-frontend   # Frontend만
make dev-llm        # LLM만
```

## 🔑 환경 변수

`.env` 파일에서 필수 설정:
```bash
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_PASSWORD=your_secure_password
```

## 🐛 문제 해결

### 포트 충돌
```bash
# 사용 중인 포트 확인
lsof -i :8080  # Backend
lsof -i :3000  # Frontend
lsof -i :8000  # LLM
```

### 의존성 문제
```bash
# Frontend 캐시 정리
cd frontend
rm -rf node_modules package-lock.json
npm install

# Python 캐시 정리
cd llm
rm -rf __pycache__ venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📚 API 문서

- Backend API: http://localhost:8080/swagger-ui.html
- LLM Service API: http://localhost:8000/docs

## 🤝 기여하기

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 라이선스

MIT License