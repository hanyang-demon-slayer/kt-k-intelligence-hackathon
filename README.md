# KT K-Intelligence Hackathon Project

## 📋 프로젝트 개요

KT K-Intelligence 해커톤 프로젝트로, AI 기반 채용 지원서 자동 평가 시스템을 구현한 풀스택 애플리케이션입니다.

## 🏗️ 아키텍처

```
├── backend/          # Spring Boot 백엔드 서버
├── frontend_figma/   # React + TypeScript 프론트엔드
├── llm/             # Python FastAPI LLM 서비스
└── docs/            # 프로젝트 문서
```

## 🚀 기술 스택

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Build Tool**: Gradle
- **Database**: H2 (개발), PostgreSQL (운영)
- **ORM**: JPA/Hibernate
- **Migration**: Flyway

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios

### LLM Service
- **Framework**: FastAPI
- **Language**: Python 3.11
- **AI/ML**: OpenAI API, LangChain
- **Data Processing**: Pandas, NumPy

## 📦 설치 및 실행

### 🚀 빠른 시작 (권장)

#### Option 1: 자동 설치 스크립트 사용 (가장 쉬움)

**Linux/Mac:**
```bash
# 1. 프로젝트 클론
git clone https://github.com/your-username/kt-k-intelligence-hackathon.git
cd kt-k-intelligence-hackathon

# 2. 자동 설치 실행
./install.sh
```

#### Option 2: 수동 설치

```bash
# 1. 프로젝트 클론
git clone https://github.com/your-username/kt-k-intelligence-hackathon.git
cd kt-k-intelligence-hackathon

# 2. 환경 설정 파일 생성
cp env.example .env
# .env 파일을 편집하여 필요한 API 키와 설정을 입력하세요

# 3. 모든 서비스 자동 실행 (Docker 사용)
make start
```

### 📋 사전 요구사항

#### Option 1: Docker 사용 (권장)
- Docker & Docker Compose
- Git

#### Option 2: 로컬 개발 환경
- Java 17+
- Node.js 18+
- Python 3.11+
- PostgreSQL (운영 환경)
- Redis (캐싱용)
- Git

## 🔧 상세 설치 가이드

### 🐳 Docker를 사용한 실행 (권장)

```bash
# 1. 프로젝트 클론
git clone https://github.com/your-username/kt-k-intelligence-hackathon.git
cd kt-k-intelligence-hackathon

# 2. 환경 변수 설정
cp env.example .env
# .env 파일에서 OPENAI_API_KEY 등 필요한 값들을 설정

# 3. 전체 서비스 시작
make start

# 4. 서비스 상태 확인
make status

# 5. 로그 확인
make logs
```

**접속 URL:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- LLM Service: http://localhost:8000
- API 문서: http://localhost:8080/swagger-ui.html

### 💻 로컬 개발 환경 설정

#### 1. Backend 설정
```bash
cd backend

# Gradle Wrapper 권한 설정 (Linux/Mac)
chmod +x gradlew

# 의존성 설치 및 빌드
./gradlew build

# 개발 서버 실행
./gradlew bootRun
```

#### 2. Frontend 설정
```bash
cd frontend_figma

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

#### 3. LLM Service 설정
```bash
cd llm

# Python 가상환경 생성 (권장)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는 venv\Scripts\activate  # Windows

# 의존성 설치
pip install -r requirements.txt

# 개발 서버 실행
python main.py
```

### 🔑 환경 변수 설정

`.env` 파일을 생성하고 다음 값들을 설정하세요:

```bash
# 필수 설정
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_PASSWORD=your_secure_password

# 선택적 설정 (기본값으로도 동작)
BACKEND_API_URL=http://localhost:8080
LLM_API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### 🗄️ 데이터베이스 설정

#### Docker 사용 시
데이터베이스는 자동으로 설정됩니다.

#### 로컬 PostgreSQL 사용 시
```bash
# PostgreSQL 설치 후
createdb kt_hackathon

# 환경 변수 설정
export DATABASE_URL=jdbc:postgresql://localhost:5432/kt_hackathon
export DATABASE_USERNAME=your_username
export DATABASE_PASSWORD=your_password
```

## 📚 API 문서

- Backend API: `http://localhost:8080/swagger-ui.html`
- LLM Service API: `http://localhost:8000/docs`

## 🛠️ 유용한 명령어들

### 개발 도구 명령어
```bash
# 전체 프로젝트 테스트 실행
make test

# 코드 포매팅
make format

# 린팅 실행
make lint

# 서비스 상태 확인
make status

# 로그 확인
make logs

# 전체 정리 (컨테이너 및 볼륨 삭제)
make clean

# 데이터베이스 백업
make backup-db

# 개발 환경 설정 (처음 한 번만)
make setup-dev
```

### 개별 서비스 개발 실행
```bash
# Backend만 개발 모드로 실행
make dev-backend

# Frontend만 개발 모드로 실행  
make dev-frontend

# LLM Service만 개발 모드로 실행
make dev-llm
```

### Docker 명령어
```bash
# 특정 서비스만 재시작
docker-compose restart backend

# 특정 서비스 로그 확인
docker-compose logs -f backend

# 모든 서비스 중지
docker-compose down

# 볼륨까지 포함하여 완전 정리
docker-compose down -v
```

## 🐛 문제 해결

### 자주 발생하는 문제들

#### 1. 포트 충돌 오류
```bash
# 사용 중인 포트 확인
lsof -i :8080  # Backend
lsof -i :3000  # Frontend  
lsof -i :8000  # LLM

# 포트 변경 (docker-compose.yml에서 수정)
ports:
  - "8081:8080"  # 다른 포트 사용
```

#### 2. 환경 변수 설정 오류
```bash
# .env 파일이 있는지 확인
ls -la .env

# 환경 변수 파일 복사
cp env.example .env

# 환경 변수 확인
cat .env
```

#### 3. 데이터베이스 연결 오류
```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose ps postgres

# 데이터베이스 로그 확인
docker-compose logs postgres

# 데이터베이스 재시작
docker-compose restart postgres
```

#### 4. 권한 문제 (Linux/Mac)
```bash
# Gradle Wrapper 실행 권한 부여
chmod +x backend/gradlew

# Docker 권한 문제
sudo usermod -aG docker $USER
# 로그아웃 후 재로그인 필요
```

#### 5. 의존성 설치 오류
```bash
# Node.js 캐시 정리
cd frontend_figma
rm -rf node_modules package-lock.json
npm install

# Python 캐시 정리
cd llm
rm -rf __pycache__ venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 로그 확인 방법
```bash
# 전체 서비스 로그
make logs

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f llm

# 최근 로그만 확인
docker-compose logs --tail=100 backend
```

## 🚀 배포

### 프로덕션 환경 배포
```bash
# 프로덕션 환경 변수 설정
cp env.example .env.prod
# .env.prod 파일 편집

# 프로덕션 배포
make deploy-prod
```

### 헬스체크
```bash
# 서비스 상태 확인
make health

# 개별 서비스 확인
curl http://localhost:8080/actuator/health  # Backend
curl http://localhost:3000                  # Frontend
curl http://localhost:8000/health           # LLM
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인
- 코드 작성 전 `make format`으로 포매팅
- 커밋 전 `make test`로 테스트 통과 확인
- 새로운 기능 추가 시 테스트 코드 작성
- API 변경 시 문서 업데이트

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 팀

- [팀원 1]
- [팀원 2]
- [팀원 3]

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
