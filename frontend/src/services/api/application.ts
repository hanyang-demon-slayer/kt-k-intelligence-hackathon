import { api } from '../config/axios';
import { 
  ApplicationCreateRequestDto, 
  ApplicationResponseDto, 
  EvaluationResultRequestDto
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
  
  // 지원서 상세 조회 (지원자 정보, 답변, 평가 결과 포함)
  getApplicationDetails: async (applicationId: number): Promise<ApplicationResponseDto> => {
    const response = await api.get(`/applications/${applicationId}`);
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

};
