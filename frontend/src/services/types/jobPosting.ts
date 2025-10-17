// 채용공고 관련 타입 정의

// 고용형태 열거형
export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME', 
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE'
}

// 공고상태 열거형
export enum PostingStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  EVALUATION_COMPLETE = 'EVALUATION_COMPLETE'
}

// 이력서 항목 타입
export enum ResumeItemType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  FILE = 'FILE',
  SELECT = 'SELECT',
  CATEGORY = 'CATEGORY',
  NUMERIC_RANGE = 'NUMERIC_RANGE',
  RULE_BASED_COUNT = 'RULE_BASED_COUNT',
  SCORE_RANGE = 'SCORE_RANGE',
  DURATION_BASED = 'DURATION_BASED',
  HOURS_RANGE = 'HOURS_RANGE'
}

// 등급 열거형
export enum Grade {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  NORMAL = 'NORMAL',
  POOR = 'POOR'
}

// 이력서 항목 평가 기준
export interface ResumeItemCriterionResponseDto {
  id: number;
  grade: string;
  description: string;
  scorePerGrade: number;
}

// 이력서 항목 응답 DTO
export interface ResumeItemResponseDto {
  id: number;
  name: string;
  type: ResumeItemType;
  isRequired: boolean;
  maxScore: number;
  criteria: ResumeItemCriterionResponseDto[];
}

// 자기소개서 질문 평가 기준
export interface CoverLetterQuestionCriterionResponseDto {
  id: number;
  name: string;
  overallDescription: string;
  details: {
    grade: string;
    description: string;
    scorePerGrade: number;
  }[];
}

// 자기소개서 질문 응답 DTO
export interface CoverLetterQuestionResponseDto {
  id: number;
  content: string;
  isRequired: boolean;
  maxCharacters: number;
  criteria: CoverLetterQuestionCriterionResponseDto[];
}

// 채용공고 응답 DTO
export interface JobPostingResponseDto {
  id: number;
  title: string;
  teamDepartment: string;
  jobRole: string;
  employmentType: EmploymentType;
  applicationStartDate: string;
  applicationEndDate: string;
  evaluationEndDate: string;
  description: string;
  experienceRequirements: string;
  educationRequirements: string;
  requiredSkills: string;
  totalScore: number;
  resumeScoreWeight: number;
  coverLetterScoreWeight: number;
  passingScore: number;
  aiAutomaticEvaluation: boolean;
  manualReview: boolean;
  publicLinkUrl: string;
  postingStatus: PostingStatus;
  companyId: number;
  companyName: string;
  applicationCount: number;
  resumeItems: ResumeItemResponseDto[];
  coverLetterQuestions: CoverLetterQuestionResponseDto[];
}

// 채용공고 생성 요청 DTO
export interface JobPostingCreateRequestDto {
  title: string;
  teamDepartment: string;
  jobRole: string;
  employmentType: EmploymentType;
  applicationStartDate: string;
  applicationEndDate: string;
  evaluationEndDate: string;
  description: string;
  experienceRequirements: string;
  educationRequirements: string;
  requiredSkills: string;
  totalScore: number;
  resumeScoreWeight: number;
  coverLetterScoreWeight: number;
  passingScore: number;
  aiAutomaticEvaluation: boolean;
  manualReview: boolean;
  postingStatus: PostingStatus;
  resumeItems: ResumeItemCreateRequestDto[];
  coverLetterQuestions: CoverLetterQuestionCreateRequestDto[];
}

// 이력서 항목 생성 요청 DTO
export interface ResumeItemCreateRequestDto {
  name: string;
  type: ResumeItemType;
  isRequired: boolean;
  maxScore: number;
  criteria: ResumeItemCriterionCreateRequestDto[];
}

// 이력서 항목 평가 기준 생성 요청 DTO
export interface ResumeItemCriterionCreateRequestDto {
  grade: Grade;
  description: string;
  scorePerGrade: number;
}

// 자기소개서 질문 생성 요청 DTO
export interface CoverLetterQuestionCreateRequestDto {
  content: string;
  isRequired: boolean;
  maxCharacters: number;
  criteria: CoverLetterQuestionCriterionCreateRequestDto[];
}

// 자기소개서 질문 평가 기준 생성 요청 DTO
export interface CoverLetterQuestionCriterionCreateRequestDto {
  name: string;
  overallDescription: string;
  details: {
    grade: string;
    description: string;
    scorePerGrade: number;
  }[];
}
