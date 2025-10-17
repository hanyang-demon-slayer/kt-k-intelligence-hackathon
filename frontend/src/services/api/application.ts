import { api } from '../config/axios';
import { 
  ApplicationCreateRequestDto, 
  ApplicationResponseDto, 
  EvaluationResultDto,
  CoverLetterQuestionsResponse
} from '../types';

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
