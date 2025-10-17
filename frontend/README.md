# Frontend Service

React + TypeScript 기반의 SPA로, 채용 관리자와 지원자를 위한 웹 인터페이스를 제공합니다.

## 🚀 기술 스택

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Routing**: React Router
- **Icons**: Lucide React

## 📦 의존성

주요 의존성은 `package.json`에서 관리됩니다:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "shadcn/ui": "latest",
    "axios": "^1.5.0"
  }
}
```

## 🔧 환경 설정

### 개발 환경 변수
```bash
# .env.local 파일 생성
VITE_API_BASE_URL=http://localhost:8080
VITE_LLM_API_URL=http://localhost:8000
```

### 운영 환경 변수
```bash
# .env.production 파일 생성
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_LLM_API_URL=https://your-llm-domain.com
```

## 🏃‍♂️ 실행 방법

### 개발 서버 실행
```bash
npm install
npm run dev
```

### 빌드
```bash
npm run build
```

### 프로덕션 서버 실행
```bash
npm run preview
```

### 테스트 실행
```bash
npm run test
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # shadcn/ui 기본 컴포넌트
│   ├── JobPostingForm.tsx
│   ├── ApplicationReview.tsx
│   └── ...
├── services/           # API 서비스
│   └── api.ts
├── hooks/              # 커스텀 훅
│   └── useApi.ts
├── utils/              # 유틸리티 함수
│   ├── dateUtils.ts
│   └── employmentTypeUtils.ts
├── styles/             # 스타일 파일
│   └── globals.css
└── main.tsx           # 애플리케이션 진입점
```

## 🎨 UI 컴포넌트

### shadcn/ui 컴포넌트
- Button, Input, Card, Dialog 등 기본 UI 컴포넌트
- Tailwind CSS 기반 스타일링
- 접근성(a11y) 지원

### 커스텀 컴포넌트
- `JobPostingForm` - 채용공고 생성/수정 폼
- `ApplicationReview` - 지원서 검토 및 평가
- `EvaluationCriteriaModal` - 평가 기준 설정
- `WorkspaceManagement` - 워크스페이스 관리

## 🔗 API 연동

### HTTP 클라이언트 설정
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});
```

### 주요 API 호출
- 채용공고 CRUD
- 지원서 제출 및 조회
- 평가 결과 조회
- 파일 업로드

## 🎯 주요 기능

### 채용 관리자
- 채용공고 생성 및 관리
- 지원서 검토 및 평가
- 평가 기준 설정
- 통계 및 대시보드

### 지원자
- 지원서 작성 및 제출
- 지원 현황 조회

## 🧪 테스트

### 테스트 실행
```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:coverage
```

### 테스트 파일 구조
```
src/
├── components/
│   ├── __tests__/
│   │   └── JobPostingForm.test.tsx
│   └── JobPostingForm.tsx
└── utils/
    ├── __tests__/
    │   └── dateUtils.test.ts
    └── dateUtils.ts
```

## 🚀 빌드 및 배포

### 빌드 최적화
```bash
# 프로덕션 빌드
npm run build

# 빌드 분석
npm run build:analyze
```

### 정적 파일 서빙
```bash
# Nginx 설정 예시
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔧 개발 도구

### 코드 품질
- ESLint - 코드 린팅
- Prettier - 코드 포매팅
- TypeScript - 타입 체킹

### 개발 환경
- Vite - 빠른 개발 서버
- Hot Module Replacement (HMR)
- TypeScript 지원

## 📱 반응형 디자인

- Mobile First 접근법
- Tailwind CSS 반응형 클래스 사용
- 다양한 화면 크기 지원

## 🔒 보안

- XSS 방지
- CSRF 토큰 사용
- API 키 환경 변수 관리
- HTTPS 강제 (운영 환경)
