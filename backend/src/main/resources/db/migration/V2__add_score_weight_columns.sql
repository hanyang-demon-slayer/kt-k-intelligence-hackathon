-- JobPosting 테이블에 resume_score_weight, cover_letter_score_weight 컬럼 추가
ALTER TABLE job_postings 
ADD COLUMN resume_score_weight INTEGER,
ADD COLUMN cover_letter_score_weight INTEGER;

-- 기본값 설정 (기존 데이터를 위해)
UPDATE job_postings 
SET resume_score_weight = 50, cover_letter_score_weight = 50 
WHERE resume_score_weight IS NULL OR cover_letter_score_weight IS NULL;
