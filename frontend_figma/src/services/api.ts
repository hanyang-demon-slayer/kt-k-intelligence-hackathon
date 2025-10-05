// API 서비스 파일 - 백엔드 DTO 구조에 맞춰 재구성
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 백엔드 DTO와 일치하는 TypeScript 타입 정의

// 회사 관련 타입
export interface CompanyResponseDto {
  id: number;
  name: string;
}

export interface CompanyCreateRequestDto {
  name: string;
}

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

// 지원서 상태 열거형
export enum ApplicationStatus {
  BEFORE_EVALUATION = 'BEFORE_EVALUATION',
  IN_PROGRESS = 'IN_PROGRESS',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  ON_HOLD = 'ON_HOLD'
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
  maxScore: number; // 최대점수
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
  applicationCount: number; // 지원서 수 추가
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
  maxScore: number; // 최대점수
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
  // 백엔드에서 실제로 반환하는 필드들
  total_score: number;
  resume_scores: any; // JSON 문자열 또는 배열
  cover_letter_scores: any; // JSON 문자열 또는 배열
  overall_evaluation: any; // JSON 문자열 또는 객체
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

// 회사 관련 API
export const companyApi = {
  // 회사 등록
  createCompany: async (companyData: CompanyCreateRequestDto): Promise<CompanyResponseDto> => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },
  
  // 회사 조회
  getCompany: async (): Promise<CompanyResponseDto> => {
    const response = await api.get('/companies');
    return response.data;
  },
};

// 채용공고 관련 API
export const jobPostingApi = {
  // 채용공고 등록
  createJobPosting: async (jobPostingData: JobPostingCreateRequestDto): Promise<JobPostingResponseDto> => {
    const response = await api.post('/job-postings', jobPostingData);
    return response.data;
  },
  
  // 채용공고 조회
  getJobPosting: async (id: number): Promise<JobPostingResponseDto> => {
    const response = await api.get(`/job-postings/${id}`);
    return response.data;
  },
  
  // 채용공고 목록 조회
  getJobPostings: async (): Promise<JobPostingResponseDto[]> => {
    const response = await api.get('/job-postings');
    return response.data;
  },
  
  // 공개 채용공고 조회 (지원자용)
  getPublicJobPosting: async (id: number): Promise<JobPostingResponseDto> => {
    const response = await api.get(`/job-postings/public/${id}`);
    return response.data;
  },
  
  // 채용공고 수정
  updateJobPosting: async (id: number, jobPostingData: JobPostingCreateRequestDto): Promise<JobPostingResponseDto> => {
    const response = await api.put(`/job-postings/${id}`, jobPostingData);
    return response.data;
  },
};

// 지원서 관련 API
export const applicationApi = {
  // 지원서 제출
  submitApplication: async (jobPostingId: number, applicationData: ApplicationCreateRequestDto): Promise<ApplicationResponseDto> => {
    const response = await api.post(`/applications/job-postings/${jobPostingId}`, applicationData);
    return response.data;
  },
  
  // 지원서 목록 조회
  getApplications: async (): Promise<ApplicationResponseDto[]> => {
    const response = await api.get('/applications');
    return response.data;
  },
  
  // 공고별 지원서 조회
  getApplicationsByJobPosting: async (jobPostingId: number): Promise<ApplicationResponseDto[]> => {
    const response = await api.get(`/applications/job-postings/${jobPostingId}`);
    return response.data;
  },
  
  // 지원서 ID로 지원자 정보와 답변 조회
  getApplicationDetails: async (applicationId: number): Promise<any> => {
    const response = await api.get(`/applications/${applicationId}/details`);
    return response.data;
  },

  // 지원서의 자기소개서 문항 데이터 조회
  getCoverLetterQuestions: async (applicationId: number): Promise<CoverLetterQuestionsResponse> => {
    const response = await api.get(`/applications/${applicationId}/cover-letter-questions`);
    return response.data;
  },
  
  // 지원서 평가 결과 조회
  getApplicationEvaluationResult: async (applicationId: number): Promise<EvaluationResultDto | null> => {
    try {
      const response = await api.get(`/applications/${applicationId}/details`);
      return response.data.evaluationResult || null;
    } catch (error) {
      console.error('평가 결과 조회 실패:', error);
      return null;
    }
  },
  
  // 지원서 통계 조회
  getApplicationStatistics: async (): Promise<{
    totalApplications: number;
    totalCompletedEvaluations: number;
    totalPendingEvaluations: number;
    totalCompletionRate: number;
    jobPostingStatistics: Array<{
      jobPostingId: number;
      jobPostingTitle: string;
      totalApplications: number;
      completedEvaluations: number;
      pendingEvaluations: number;
      completionRate: number;
      postingStatus: string;
    }>;
  }> => {
    const response = await api.get('/applications/statistics');
    return response.data;
  },
  
  // 공고별 평가 기준 조회
  getEvaluationCriteria: async (jobPostingId: number): Promise<{
    jobPostingId: number;
    jobPostingTitle: string;
    totalScore: number;
    resumeScoreWeight: number;
    coverLetterScoreWeight: number;
    passingScore: number;
    resumeCriteria: Array<{
      id: number;
      name: string;
      type: string;
      isRequired: boolean;
      maxScore: number;
      criteria: Array<{
        grade: string;
        description: string;
        scorePerGrade: number;
      }>;
    }>;
    coverLetterCriteria: Array<{
      id: number;
      content: string;
      isRequired: boolean;
      maxCharacters: number;
      criteria: Array<{
        name: string;
        overallDescription: string;
        details: Array<{
          grade: string;
          description: string;
          scorePerGrade: number;
        }>;
      }>;
    }>;
  }> => {
    const response = await api.get(`/applications/job-postings/${jobPostingId}/evaluation-criteria`);
    return response.data;
  },
  
  // 지원서 평가 의견 및 상태 저장
  saveEvaluation: async (applicationId: number, evaluationData: { comment: string; status: string; finalScore?: number }): Promise<string> => {
    const response = await api.put(`/applications/${applicationId}/evaluation`, evaluationData);
    return response.data;
  },
  
  // 평가 결과 처리
  processEvaluationResult: async (evaluationResult: any): Promise<string> => {
    const response = await api.post('/applications/evaluation-result', evaluationResult);
    return response.data;
  },

  // 새로운 통합 API: 공고별 모든 데이터 조회 (지원서, 이력서, 자소서, 평가결과 포함)
  getJobPostingWithApplications: async (jobPostingId: number): Promise<any> => {
    const response = await api.get(`/job-postings/${jobPostingId}/with-applications`);
    return response.data;
  },

  // ApplicationId로 evaluationResult 조회 (FastAPI에서 조회하고 저장)
  getEvaluationResultByApplicationId: async (applicationId: number): Promise<any> => {
    const response = await api.get(`/applications/${applicationId}/evaluation-result`);
    return response.data;
  }
};

// 유틸리티 함수들
export const apiUtils = {
  // 백엔드 PostingStatus를 프론트엔드 status로 변환
  convertPostingStatus: (postingStatus: PostingStatus): 'recruiting' | 'scheduled' | 'recruitment-completed' | 'evaluation-completed' => {
    switch (postingStatus) {
      case PostingStatus.IN_PROGRESS:
        return 'recruiting';
      case PostingStatus.SCHEDULED:
        return 'scheduled';
      case PostingStatus.CLOSED:
        return 'recruitment-completed';
      case PostingStatus.EVALUATION_COMPLETE:
        return 'evaluation-completed';
      default:
        return 'scheduled';
    }
  },
  
  // 프론트엔드 status를 백엔드 PostingStatus로 변환
  convertToPostingStatus: (status: 'recruiting' | 'scheduled' | 'recruitment-completed' | 'evaluation-completed'): PostingStatus => {
    switch (status) {
      case 'recruiting':
        return PostingStatus.IN_PROGRESS;
      case 'scheduled':
        return PostingStatus.SCHEDULED;
      case 'recruitment-completed':
        return PostingStatus.CLOSED;
      case 'evaluation-completed':
        return PostingStatus.EVALUATION_COMPLETE;
      default:
        return PostingStatus.SCHEDULED;
    }
  },
  
  // 백엔드 ApplicationStatus를 프론트엔드 status로 변환
  convertApplicationStatus: (applicationStatus: ApplicationStatus): 'passed' | 'failed' | 'pending' | 'not-evaluated' | 'unqualified' => {
    switch (applicationStatus) {
      case ApplicationStatus.ACCEPTED:
        return 'passed';
      case ApplicationStatus.REJECTED:
        return 'unqualified';
      case ApplicationStatus.BEFORE_EVALUATION:
        return 'not-evaluated';
      case ApplicationStatus.IN_PROGRESS:
        return 'pending';
      case ApplicationStatus.ON_HOLD:
        return 'pending';
      default:
        return 'not-evaluated';
    }
  },
  
  // 프론트엔드 status를 백엔드 ApplicationStatus로 변환
  convertToApplicationStatus: (status: 'passed' | 'failed' | 'pending' | 'not-evaluated' | 'unqualified'): ApplicationStatus => {
    switch (status) {
      case 'passed':
        return ApplicationStatus.ACCEPTED;
      case 'unqualified':
        return ApplicationStatus.REJECTED;
      case 'not-evaluated':
        return ApplicationStatus.BEFORE_EVALUATION;
      case 'pending':
        return ApplicationStatus.IN_PROGRESS;
      default:
        return ApplicationStatus.BEFORE_EVALUATION;
    }
  }
};

export default api;
