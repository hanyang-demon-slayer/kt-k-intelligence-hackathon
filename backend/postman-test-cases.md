# 🚀 백엔드 API Postman 테스트 케이스

## 📋 기본 설정

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`

---

## 🏢 JobPostingController 테스트

### 1. 채용공고 등록
**POST** `/api/job-postings`

```json
{
  "title": "백엔드 개발자 채용",
  "teamDepartment": "개발팀",
  "jobRole": "백엔드 개발자",
  "employmentType": "FULL_TIME",
  "applicationStartDate": "2024-01-01T00:00:00",
  "applicationEndDate": "2024-12-31T23:59:59",
  "evaluationEndDate": "2025-01-15T23:59:59",
  "description": "Spring Boot 기반 백엔드 개발을 담당할 개발자를 모집합니다.",
  "experienceRequirements": "3년 이상",
  "educationRequirements": "대학교 졸업 이상",
  "requiredSkills": "Java, Spring Boot, MySQL, REST API",
  "totalScore": 100,
  "resumeScoreWeight": 60,
  "coverLetterScoreWeight": 40,
  "passingScore": 70,
  "aiAutomaticEvaluation": true,
  "manualReview": true,
  "resumeItems": [
    {
      "name": "학력",
      "type": "TEXT",
      "isRequired": true,
      "maxScore": 20,
      "criteria": [
        {
          "grade": "EXCELLENT",
          "description": "명문대 졸업 또는 석사 이상",
          "scorePerGrade": 20
        },
        {
          "grade": "GOOD",
          "description": "4년제 대학교 졸업",
          "scorePerGrade": 15
        },
        {
          "grade": "NORMAL",
          "description": "전문대 졸업",
          "scorePerGrade": 10
        },
        {
          "grade": "POOR",
          "description": "고등학교 졸업",
          "scorePerGrade": 5
        }
      ]
    },
    {
      "name": "경력",
      "type": "NUMBER",
      "isRequired": true,
      "maxScore": 20,
      "criteria": [
        {
          "grade": "EXCELLENT",
          "description": "5년 이상",
          "scorePerGrade": 20
        },
        {
          "grade": "GOOD",
          "description": "3-4년",
          "scorePerGrade": 15
        },
        {
          "grade": "NORMAL",
          "description": "1-2년",
          "scorePerGrade": 10
        },
        {
          "grade": "POOR",
          "description": "신입",
          "scorePerGrade": 5
        }
      ]
    },
    {
      "name": "자격증",
      "type": "TEXT",
      "isRequired": false,
      "maxScore": 20,
      "criteria": [
        {
          "grade": "EXCELLENT",
          "description": "관련 자격증 3개 이상",
          "scorePerGrade": 20
        },
        {
          "grade": "GOOD",
          "description": "관련 자격증 1-2개",
          "scorePerGrade": 15
        },
        {
          "grade": "NORMAL",
          "description": "기본 자격증",
          "scorePerGrade": 10
        },
        {
          "grade": "POOR",
          "description": "자격증 없음",
          "scorePerGrade": 0
        }
      ]
    }
  ],
  "coverLetterQuestions": [
    {
      "content": "지원 동기를 500자 이내로 작성해주세요.",
      "isRequired": true,
      "maxCharacters": 500,
      "criteria": [
        {
          "name": "지원동기 명확성",
          "overallDescription": "지원 동기가 명확하고 구체적인지 평가",
          "details": [
            {
              "grade": "EXCELLENT",
              "description": "매우 구체적이고 설득력 있는 지원 동기",
              "scorePerGrade": 20
            },
            {
              "grade": "GOOD",
              "description": "명확한 지원 동기",
              "scorePerGrade": 15
            },
            {
              "grade": "NORMAL",
              "description": "일반적인 지원 동기",
              "scorePerGrade": 10
            },
            {
              "grade": "POOR",
              "description": "모호하거나 부적절한 지원 동기",
              "scorePerGrade": 5
            }
          ]
        }
      ]
    },
    {
      "content": "프로젝트 경험을 300자 이내로 설명해주세요.",
      "isRequired": true,
      "maxCharacters": 300,
      "criteria": [
        {
          "name": "프로젝트 경험 풍부성",
          "overallDescription": "프로젝트 경험의 풍부함과 관련성을 평가",
          "details": [
            {
              "grade": "EXCELLENT",
              "description": "풍부하고 관련성 높은 프로젝트 경험",
              "scorePerGrade": 20
            },
            {
              "grade": "GOOD",
              "description": "적절한 프로젝트 경험",
              "scorePerGrade": 15
            },
            {
              "grade": "NORMAL",
              "description": "기본적인 프로젝트 경험",
              "scorePerGrade": 10
            },
            {
              "grade": "POOR",
              "description": "프로젝트 경험 부족",
              "scorePerGrade": 5
            }
          ]
        }
      ]
    }
  ]
}
```

### 2. 채용공고 조회
**GET** `/api/job-postings/{id}`

**Path Variables:**
- `id`: `1` (생성된 채용공고 ID)

### 3. 채용공고 목록 조회
**GET** `/api/job-postings`

### 4. 채용공고 수정
**PUT** `/api/job-postings/{id}`

**Path Variables:**
- `id`: `1`

```json
{
  "title": "시니어 백엔드 개발자 채용 (수정)",
  "teamDepartment": "개발팀",
  "jobRole": "시니어 백엔드 개발자",
  "employmentType": "FULL_TIME",
  "applicationStartDate": "2024-01-01T00:00:00",
  "applicationEndDate": "2024-12-31T23:59:59",
  "evaluationEndDate": "2025-01-15T23:59:59",
  "description": "Spring Boot 기반 백엔드 개발을 담당할 시니어 개발자를 모집합니다.",
  "experienceRequirements": "5년 이상",
  "educationRequirements": "대학교 졸업 이상",
  "requiredSkills": "Java, Spring Boot, MySQL, REST API, Microservices",
  "totalScore": 100,
  "resumeScoreWeight": 60,
  "coverLetterScoreWeight": 40,
  "passingScore": 75,
  "aiAutomaticEvaluation": true,
  "manualReview": true,
  "resumeItems": [
    {
      "name": "학력",
      "type": "TEXT",
      "isRequired": true,
      "maxScore": 20,
      "criteria": [
        {
          "grade": "EXCELLENT",
          "description": "명문대 졸업 또는 석사 이상",
          "scorePerGrade": 20
        },
        {
          "grade": "GOOD",
          "description": "4년제 대학교 졸업",
          "scorePerGrade": 15
        },
        {
          "grade": "NORMAL",
          "description": "전문대 졸업",
          "scorePerGrade": 10
        },
        {
          "grade": "POOR",
          "description": "고등학교 졸업",
          "scorePerGrade": 5
        }
      ]
    }
  ],
  "coverLetterQuestions": [
    {
      "content": "지원 동기를 500자 이내로 작성해주세요.",
      "isRequired": true,
      "maxCharacters": 500,
      "criteria": [
        {
          "name": "지원동기 명확성",
          "overallDescription": "지원 동기가 명확하고 구체적인지 평가",
          "details": [
            {
              "grade": "EXCELLENT",
              "description": "매우 구체적이고 설득력 있는 지원 동기",
              "scorePerGrade": 20
            },
            {
              "grade": "GOOD",
              "description": "명확한 지원 동기",
              "scorePerGrade": 15
            },
            {
              "grade": "NORMAL",
              "description": "일반적인 지원 동기",
              "scorePerGrade": 10
            },
            {
              "grade": "POOR",
              "description": "모호하거나 부적절한 지원 동기",
              "scorePerGrade": 5
            }
          ]
        }
      ]
    }
  ]
}
```

### 5. 채용공고와 모든 지원서 데이터 조회 (통합 API)
**GET** `/api/job-postings/{id}/with-applications`

**Path Variables:**
- `id`: `1`

### 6. 공고별 평가 기준 조회
**GET** `/api/job-postings/{jobPostingId}/evaluation-criteria`

**Path Variables:**
- `jobPostingId`: `1`

---

## 📝 ApplicationController 테스트

### 7. 지원서 제출
**POST** `/api/applications/job-postings/{jobPostingId}`

**Path Variables:**
- `jobPostingId`: `1`

```json
{
  "applicantName": "김개발",
  "applicantEmail": "kimdev@example.com",
  "resumeItemAnswers": [
    {
      "resumeItemId": 1,
      "resumeItemName": "학력",
      "resumeContent": "서울대학교 컴퓨터공학과 졸업 (2020년)"
    },
    {
      "resumeItemId": 2,
      "resumeItemName": "경력",
      "resumeContent": "3년"
    },
    {
      "resumeItemId": 3,
      "resumeItemName": "자격증",
      "resumeContent": "정보처리기사, AWS Solutions Architect"
    }
  ],
  "coverLetterQuestionAnswers": [
    {
      "coverLetterQuestionId": 1,
      "questionContent": "지원 동기를 500자 이내로 작성해주세요.",
      "answerContent": "저는 백엔드 개발에 대한 깊은 관심과 열정을 가지고 있습니다. 특히 Spring Boot를 활용한 RESTful API 개발과 마이크로서비스 아키텍처 구축에 경험이 있으며, 팀워크를 중시하며 지속적인 학습을 통해 성장하고자 합니다. 귀사의 혁신적인 프로젝트에 참여하여 더 나은 개발자로 성장하고 싶습니다."
    },
    {
      "coverLetterQuestionId": 2,
      "questionContent": "프로젝트 경험을 300자 이내로 설명해주세요.",
      "answerContent": "이전 회사에서 Spring Boot와 MySQL을 활용한 전자상거래 플랫폼 백엔드 개발을 담당했습니다. RESTful API 설계, JWT 인증 구현, Redis 캐싱 최적화 등을 통해 시스템 성능을 30% 향상시켰습니다. 또한 Docker를 활용한 컨테이너화와 CI/CD 파이프라인 구축 경험도 있습니다."
    }
  ]
}
```

### 8. 지원서 목록 조회
**GET** `/api/applications`

### 9. 공고별 지원서 조회
**GET** `/api/applications/job-postings/{jobPostingId}`

**Path Variables:**
- `jobPostingId`: `1`

### 10. 지원서 상세 조회
**GET** `/api/applications/{applicationId}`

**Path Variables:**
- `applicationId`: `1`

### 11. AI 평가 결과 처리 (FastAPI에서 호출)
**POST** `/api/applications/evaluation-result`

```json
{
  "applicantId": 1,
  "applicantName": "김개발",
  "applicantEmail": "kimdev@example.com",
  "applicationId": 1,
  "jobPostingId": 1,
  "resumeEvaluations": [
    {
      "resumeItemId": 1,
      "resumeItemName": "학력",
      "resumeContent": "서울대학교 컴퓨터공학과 졸업 (2020년)",
      "score": 20
    },
    {
      "resumeItemId": 2,
      "resumeItemName": "경력",
      "resumeContent": "3년",
      "score": 15
    },
    {
      "resumeItemId": 3,
      "resumeItemName": "자격증",
      "resumeContent": "정보처리기사, AWS Solutions Architect",
      "score": 20
    }
  ],
  "coverLetterQuestionEvaluations": [
    {
      "coverLetterQuestionId": 1,
      "keywords": ["백엔드 개발", "Spring Boot", "RESTful API", "마이크로서비스", "학습"],
      "summary": "백엔드 개발에 대한 열정과 Spring Boot 경험을 바탕으로 한 지원 동기",
      "answerEvaluations": [
        {
          "evaluationCriteriaName": "지원동기 명확성",
          "grade": "EXCELLENT",
          "evaluatedContent": "백엔드 개발에 대한 깊은 관심과 열정을 가지고 있습니다",
          "evaluationReason": "구체적이고 명확한 지원 동기를 제시함"
        }
      ]
    },
    {
      "coverLetterQuestionId": 2,
      "keywords": ["Spring Boot", "MySQL", "RESTful API", "JWT", "Redis", "Docker"],
      "summary": "전자상거래 플랫폼 백엔드 개발 경험과 성능 최적화 실적",
      "answerEvaluations": [
        {
          "evaluationCriteriaName": "프로젝트 경험 풍부성",
          "grade": "EXCELLENT",
          "evaluatedContent": "Spring Boot와 MySQL을 활용한 전자상거래 플랫폼 백엔드 개발",
          "evaluationReason": "관련성 높은 프로젝트 경험과 구체적인 성과 제시"
        }
      ]
    }
  ],
  "overallAnalysis": {
    "overallEvaluation": "백엔드 개발에 대한 명확한 비전과 풍부한 기술 경험을 보유한 우수한 지원자",
    "strengths": [
      "Spring Boot 기반 백엔드 개발 경험",
      "RESTful API 설계 및 구현 능력",
      "성능 최적화 경험 (30% 향상)",
      "Docker 및 CI/CD 파이프라인 구축 경험",
      "지속적인 학습 의지"
    ],
    "improvements": [
      "마이크로서비스 아키텍처 경험 확장",
      "클라우드 인프라 관리 경험",
      "팀 리더십 경험",
      "코드 리뷰 및 멘토링 경험",
      "성능 모니터링 도구 활용 경험"
    ],
    "aiRecommendation": "합격 권장",
    "aiReliability": 0.92
  }
}
```

### 12. 평가 결과 조회
**GET** `/api/applications/{applicationId}/evaluation-result`

**Path Variables:**
- `applicationId`: `1`

### 13. 지원서 평가 의견 및 상태 저장
**PUT** `/api/applications/{applicationId}/evaluation`

**Path Variables:**
- `applicationId`: `1`

```json
{
  "comment": "기술적 역량이 우수하고 백엔드 개발에 대한 열정이 뛰어납니다. 특히 성능 최적화 경험과 지속적인 학습 의지가 인상적입니다. 최종 면접을 통해 팀워크와 커뮤니케이션 능력을 확인하고 싶습니다.",
  "status": "APPROVED"
}
```

**Status 옵션:**
- `PENDING`: 대기
- `IN_PROGRESS`: 평가중
- `APPROVED`: 합격
- `REJECTED`: 불합격

---

## 🧪 테스트 시나리오

### 시나리오 1: 전체 플로우 테스트
1. 채용공고 등록 (API #1)
2. 지원서 제출 (API #7)
3. AI 평가 결과 처리 (API #11)
4. 평가 결과 조회 (API #12)
5. HR 평가 저장 (API #13)

### 시나리오 2: 에러 케이스 테스트
1. 잘못된 채용공고 ID로 지원서 제출
2. 존재하지 않는 지원서 ID로 조회
3. 잘못된 상태값으로 평가 저장

### 시나리오 3: 데이터 검증 테스트
1. 필수 필드 누락된 채용공고 등록
2. 잘못된 이메일 형식으로 지원서 제출
3. 글자수 초과된 자기소개서 답변

---

## 📊 예상 응답 예시

### 성공 응답 (200 OK)
```json
{
  "id": 1,
  "applicantName": "김개발",
  "applicantEmail": "kimdev@example.com",
  "jobPostingId": 1,
  "status": "PENDING",
  "submittedAt": "2024-01-15T10:30:00",
  "resumeItemAnswers": [...],
  "coverLetterQuestionAnswers": [...]
}
```

### 에러 응답 (400 Bad Request)
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "지원자 이름은 필수입니다",
  "path": "/api/applications/job-postings/1"
}
```

---

## 🔧 Postman 설정 팁

1. **Environment Variables 설정:**
   - `base_url`: `http://localhost:8080`
   - `job_posting_id`: `1`
   - `application_id`: `1`

2. **Pre-request Scripts:**
   ```javascript
   // 동적 데이터 생성
   pm.environment.set("timestamp", new Date().toISOString());
   pm.environment.set("random_email", "test" + Math.random() + "@example.com");
   ```

3. **Tests Scripts:**
   ```javascript
   // 응답 검증
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });
   
   pm.test("Response has required fields", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData).to.have.property('id');
   });
   ```

이 테스트 케이스들을 사용하여 모든 API 엔드포인트를 체계적으로 테스트할 수 있습니다! 🚀
