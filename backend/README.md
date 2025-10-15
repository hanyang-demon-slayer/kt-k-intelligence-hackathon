# Backend Service

Spring Boot 기반의 REST API 서버로, 채용 지원서 관리 및 평가 시스템의 백엔드를 담당합니다.

## 🚀 기술 스택

- **Framework**: Spring Boot 3.2.x
- **Language**: Java 17
- **Build Tool**: Gradle 8.x
- **Database**: H2 (개발), PostgreSQL (운영)
- **ORM**: JPA/Hibernate
- **Migration**: Flyway
- **Documentation**: Swagger/OpenAPI 3

## 📦 의존성

주요 의존성은 `build.gradle`에서 관리됩니다:

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.flywaydb:flyway-core'
    implementation 'com.h2database:h2'
    implementation 'org.postgresql:postgresql'
    // ... 기타 의존성들
}
```

## 🔧 환경 설정

### 개발 환경
```bash
# H2 데이터베이스 사용 (기본값)
# 별도 설정 불필요
```

### 운영 환경
```bash
# PostgreSQL 사용 시
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=postgresql://localhost:5432/kt_hackathon
export DATABASE_USERNAME=your_username
export DATABASE_PASSWORD=your_password
```

## 🏃‍♂️ 실행 방법

### 개발 서버 실행
```bash
./gradlew bootRun
```

### JAR 빌드 및 실행
```bash
./gradlew build
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

### 테스트 실행
```bash
./gradlew test
```

## 📊 API 엔드포인트

### 주요 API
- `GET /api/job-postings` - 채용공고 목록 조회
- `POST /api/job-postings` - 채용공고 생성
- `GET /api/applications` - 지원서 목록 조회
- `POST /api/applications` - 지원서 제출
- `POST /api/evaluation` - 평가 결과 처리

### API 문서
서버 실행 후 다음 URL에서 Swagger UI를 확인할 수 있습니다:
- http://localhost:8080/swagger-ui.html

## 🗄️ 데이터베이스

### 스키마 마이그레이션
Flyway를 사용하여 데이터베이스 스키마를 관리합니다:
- 마이그레이션 파일: `src/main/resources/db/migration/`
- 서버 시작 시 자동으로 마이그레이션 실행

### 주요 엔티티
- `Company` - 회사 정보
- `JobPosting` - 채용공고
- `Applicant` - 지원자
- `Application` - 지원서
- `EvaluationResult` - 평가 결과

## 🔒 보안

- JWT 토큰 기반 인증 (향후 구현 예정)
- CORS 설정
- 입력 데이터 검증 (Bean Validation)

## 📝 로깅

- SLF4J + Logback 사용
- 로그 레벨: 개발(DEBUG), 운영(INFO)
- 로그 파일: `logs/application.log`

## 🧪 테스트

### 테스트 실행
```bash
# 전체 테스트
./gradlew test

# 특정 테스트 클래스
./gradlew test --tests BackendApplicationTests

# 통합 테스트
./gradlew integrationTest
```

### 테스트 커버리지
```bash
./gradlew jacocoTestReport
```
결과는 `build/reports/jacoco/test/html/index.html`에서 확인 가능합니다.

## 🚀 배포

### Docker를 이용한 배포
```bash
# Docker 이미지 빌드
docker build -t kt-hackathon-backend .

# 컨테이너 실행
docker run -p 8080:8080 kt-hackathon-backend
```

### 환경별 설정
- `application.yml` - 공통 설정
- `application-dev.yml` - 개발 환경
- `application-prod.yml` - 운영 환경
