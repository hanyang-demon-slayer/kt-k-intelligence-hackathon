// 지원서 관련 타입 정의

// 지원서 상태 열거형
export enum ApplicationStatus {
  BEFORE_EVALUATION = 'BEFORE_EVALUATION',
  IN_PROGRESS = 'IN_PROGRESS',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  ON_HOLD = 'ON_HOLD'
}

// 지원서 응답 DTO
export interface ApplicationResponseDto {
  id: number;
  status: ApplicationStatus;
  applicantName: string;
  applicantEmail: string;
  jobPostingId: number;
  jobPostingTitle: string;
  evaluationComment: string;
  passingScore: number;
}

// 지원서 생성 요청 DTO
export interface ApplicationCreateRequestDto {
  applicantName: string;
  applicantEmail: string;
  resumeItemAnswers: ResumeItemAnswerCreateDto[];
  coverLetterQuestionAnswers: CoverLetterQuestionAnswerCreateDto[];
}

// 평가 결과 관련 타입
export interface EvaluationResultDto {
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  applicationId: number;
  jobPostingId: number;
  jobPostingTitle: string;
  companyName: string;
  resumeEvaluations: ResumeEvaluationDto[];
  coverLetterQuestionEvaluations: CoverLetterQuestionEvaluationDto[];
  overallAnalysis: OverallAnalysisDto;
  total_score: number;
  resume_scores: any;
  cover_letter_scores: any;
  overall_evaluation: any;
}

// 자기소개서 문항 데이터 타입
export interface CoverLetterQuestionData {
  coverLetterQuestionId: number;
  questionContent: string;
  answerContent: string;
  keywords: string[];
  summary: string;
  answerEvaluations: any[];
  charCount: string;
  maxChars: number;
  answerLength: number;
}

export interface CoverLetterQuestionsResponse {
  applicationId: number;
  applicantName: string;
  coverLetterQuestions: CoverLetterQuestionData[];
  totalQuestions: number;
}

export interface ResumeEvaluationDto {
  resumeItemId: number;
  resumeItemName: string;
  resumeContent: string;
  score: number;
  maxScore: number;
}

export interface CoverLetterQuestionEvaluationDto {
  coverLetterQuestionId: number;
  keywords: string[];
  summary: string;
  answerEvaluations: CoverLetterAnswerEvaluationDto[];
}

export interface CoverLetterAnswerEvaluationDto {
  evaluationCriteriaId: number;
  evaluationCriteriaName: string;
  grade: string;
  evaluatedContent: string;
  evaluationReason: string;
}

export interface OverallAnalysisDto {
  overallEvaluation: string;
  strengths: string[];
  improvements: string[];
  aiRecommendation: string;
  aiReliability: number;
}

export interface ResumeItemAnswerCreateDto {
  resumeItemId: number;
  resumeItemName: string;
  resumeContent: string;
}

export interface CoverLetterQuestionAnswerCreateDto {
  coverLetterQuestionId: number;
  questionContent: string;
  answerContent: string;
}
