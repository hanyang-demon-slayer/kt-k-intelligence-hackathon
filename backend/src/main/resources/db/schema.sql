-- =============================================
-- 채용관리 시스템 데이터베이스 스키마
-- =============================================

-- 1. 회사 테이블
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '회사 ID',
    name VARCHAR(255) NOT NULL COMMENT '회사명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시'
) COMMENT '회사 엔티티';

-- 2. 채용공고 테이블
CREATE TABLE job_postings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '채용공고 ID',
    title VARCHAR(255) NOT NULL COMMENT '공고 제목',
    team_department VARCHAR(255) COMMENT '팀/부서',
    job_role VARCHAR(255) COMMENT '직무',
    employment_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE') NOT NULL COMMENT '고용형태: 정규직/계약직/인턴 등',
    application_start_date DATETIME COMMENT '모집 시작일 (이후 마감/평가일과의 일관성은 서비스/검증에서 보장)',
    application_end_date DATETIME COMMENT '모집 마감일',
    evaluation_end_date DATETIME COMMENT '평가 마감일',
    description TEXT COMMENT '설명',
    experience_requirements TEXT COMMENT '경력 요구사항',
    education_requirements TEXT COMMENT '학력 요구사항',
    required_skills TEXT COMMENT '요구기술, 스킬',
    total_score INT DEFAULT 0 COMMENT '총점',
    resume_score_weight INT DEFAULT 0 COMMENT '이력서 배점 비중',
    cover_letter_score_weight INT DEFAULT 0 COMMENT '자기소개서 배점 비중',
    passing_score INT DEFAULT 0 COMMENT '합격기준점수',
    ai_automatic_evaluation BOOLEAN DEFAULT FALSE COMMENT 'AI 자동평가여부',
    manual_review BOOLEAN DEFAULT FALSE COMMENT '수동 검토여부',
    posting_status ENUM('SCHEDULED', 'IN_PROGRESS', 'CLOSED', 'EVALUATION_COMPLETE') COMMENT '공고 상태: 예정/진행/마감/평가완료',
    public_link_url VARCHAR(500) COMMENT '공개 링크 URL',
    company_id BIGINT NOT NULL COMMENT '하나의 공고는 하나의 회사에 속한다 (N:1). 연관 주인은 이쪽(FK 보유)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) COMMENT '채용공고 엔티티';

-- 3. 지원자 테이블
CREATE TABLE applicants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '지원자 ID',
    name VARCHAR(255) NOT NULL COMMENT '이름',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT '이메일',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시'
) COMMENT '지원자 엔티티';

-- 4. 지원서 테이블
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '지원서 ID',
    status ENUM('BEFORE_EVALUATION', 'IN_PROGRESS', 'REJECTED', 'ACCEPTED', 'ON_HOLD') DEFAULT 'BEFORE_EVALUATION' COMMENT '상태 (평가전, 평가중, 평가후, 탈락, 합격, 보류)',
    applicant_id BIGINT NOT NULL COMMENT '지원자 ID',
    job_posting_id BIGINT NOT NULL COMMENT '채용공고 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE
) COMMENT '지원서 엔티티';

-- 5. 이력서 항목 테이블
CREATE TABLE resume_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '이력서 항목 ID',
    name VARCHAR(255) NOT NULL COMMENT '항목 표시명 (예: 학력, 자격증)',
    type ENUM('NUMBER', 'DATE', 'FILE', 'TEXT') COMMENT '입력 유형 (숫자/텍스트/파일/날짜 등)',
    is_required BOOLEAN DEFAULT FALSE COMMENT '필수 제출 여부',
    max_score INT COMMENT '항목별 최대 점수',
    job_posting_id BIGINT NOT NULL COMMENT '여러 ResumeItem은 하나의 JobPosting에 속한다 (N:1)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE
) COMMENT '이력서 항목 엔티티';

-- 6. 이력서 항목 평가기준 테이블
CREATE TABLE resume_item_criteria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '이력서 항목 평가기준 ID',
    grade ENUM('EXCELLENT', 'GOOD', 'NORMAL', 'POOR') COMMENT '등급 (우수/양호/보통/미흡)',
    description TEXT COMMENT '설명 (예: 박사학위)',
    score_per_grade INT COMMENT '등급별 점수',
    resume_item_id BIGINT NOT NULL COMMENT '여러 평가기준은 하나의 이력서 항목에 속한다 (N:1)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (resume_item_id) REFERENCES resume_items(id) ON DELETE CASCADE
) COMMENT '이력서 항목 평가기준 엔티티';

-- 7. 이력서 항목 답변 테이블
CREATE TABLE resume_item_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '이력서 항목 답변 ID',
    resume_content TEXT COMMENT '제출한 이력서 답변 내용',
    application_id BIGINT NOT NULL COMMENT '여러 답변은 하나의 지원서에 속함 (N:1)',
    resume_item_id BIGINT NOT NULL COMMENT '여러 답변은 하나의 이력서 항목에 속함 (N:1)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (resume_item_id) REFERENCES resume_items(id) ON DELETE CASCADE
) COMMENT '이력서 항목 답변 엔티티';

-- 8. 자기소개서 질문 테이블
CREATE TABLE cover_letter_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '자기소개서 질문 ID',
    content TEXT NOT NULL COMMENT '질문 내용',
    is_required BOOLEAN DEFAULT FALSE COMMENT '필수여부',
    max_characters INT COMMENT '최대글자수',
    max_score INT DEFAULT 0 COMMENT '질문별 최대 평가 점수',
    job_posting_id BIGINT NOT NULL COMMENT '채용공고 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE
) COMMENT '자기소개서 질문 엔티티';

-- 9. 자기소개서 질문 평가기준 테이블
CREATE TABLE cover_letter_question_criteria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '자기소개서 질문 평가기준 ID',
    name VARCHAR(255) COMMENT '평가기준 이름',
    overall_description TEXT COMMENT '전반적인 설명',
    cover_letter_question_id BIGINT NOT NULL COMMENT '자기소개서 질문 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (cover_letter_question_id) REFERENCES cover_letter_questions(id) ON DELETE CASCADE
) COMMENT '자기소개서 질문 평가기준 엔티티';

-- 10. 자기소개서 질문 평가기준 상세 테이블
CREATE TABLE cover_letter_question_criterion_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '자기소개서 질문 평가기준 상세 ID',
    grade ENUM('EXCELLENT', 'GOOD', 'NORMAL', 'POOR') COMMENT '등급 (우수, 보통 등)',
    description TEXT COMMENT '설명',
    score_per_grade INT COMMENT '등급별 점수',
    cover_letter_question_criterion_id BIGINT NOT NULL COMMENT '자기소개서 질문 평가기준 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (cover_letter_question_criterion_id) REFERENCES cover_letter_question_criteria(id) ON DELETE CASCADE
) COMMENT '자기소개서 질문 평가기준 상세 엔티티';

-- 11. 자기소개서 질문 답변 테이블
CREATE TABLE cover_letter_question_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '자기소개서 질문 답변 ID',
    answer_content TEXT COMMENT '답변 내용',
    application_id BIGINT NOT NULL COMMENT '지원서 ID',
    cover_letter_question_id BIGINT NOT NULL COMMENT '자기소개서 질문 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (cover_letter_question_id) REFERENCES cover_letter_questions(id) ON DELETE CASCADE
) COMMENT '자기소개서 질문 답변 엔티티';

-- 12. 평가결과 테이블
CREATE TABLE evaluation_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '평가결과 ID',
    application_id BIGINT NOT NULL COMMENT '지원서 ID',
    job_posting_id BIGINT NOT NULL COMMENT '채용공고 ID',
    total_score INT NOT NULL COMMENT '총점',
    resume_scores TEXT COMMENT 'JSON 형태로 저장',
    cover_letter_scores TEXT COMMENT 'JSON 형태로 저장',
    overall_evaluation TEXT COMMENT 'JSON 형태로 저장',
    evaluation_completed_at DATETIME COMMENT '평가 완료일시',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE
) COMMENT '평가 결과 엔티티';