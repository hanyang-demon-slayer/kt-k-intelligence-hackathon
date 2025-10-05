-- Remove unnecessary fields from database tables

-- Remove score_weight column from resume_items table
ALTER TABLE resume_items DROP COLUMN IF EXISTS score_weight;

-- Remove weight column from cover_letter_questions table
ALTER TABLE cover_letter_questions DROP COLUMN IF EXISTS weight;

-- Remove example file related columns from job_postings table
ALTER TABLE job_postings DROP COLUMN IF EXISTS evaluation_criteria_example_file_name;
ALTER TABLE job_postings DROP COLUMN IF EXISTS evaluation_criteria_example_file_path;
ALTER TABLE job_postings DROP COLUMN IF EXISTS cover_letter_example_file_name;
ALTER TABLE job_postings DROP COLUMN IF EXISTS cover_letter_example_file_path;
