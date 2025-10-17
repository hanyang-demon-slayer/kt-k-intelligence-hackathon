import { api } from '../config/axios';
import { JobPostingCreateRequestDto, JobPostingResponseDto } from '../types';

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
  
  
  // 채용공고 수정
  updateJobPosting: async (id: number, jobPostingData: JobPostingCreateRequestDto): Promise<JobPostingResponseDto> => {
    const response = await api.put(`/job-postings/${id}`, jobPostingData);
    return response.data;
  },
};
