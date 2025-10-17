// React Query 훅들 - 백엔드 API와 연동
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { 
  jobPostingApi, 
  applicationApi, 
  companyApi,
  JobPostingResponseDto,
  ApplicationResponseDto,
  CompanyResponseDto,
  JobPostingCreateRequestDto,
  ApplicationCreateRequestDto,
  CompanyCreateRequestDto,
  EvaluationResultDto,
  CoverLetterQuestionsResponse,
  apiUtils
} from '../services';
import { toast } from 'sonner';

// 회사 정보 조회
export const useCompany = () => {
  return useQuery<CompanyResponseDto>({
    queryKey: ['company'],
    queryFn: companyApi.getCompany,
    retry: false, // 500 오류 시 재시도하지 않음
    throwOnError: false, // 오류를 던지지 않고 상태로 관리
  });
};

// 회사 등록
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (companyData: CompanyCreateRequestDto) => companyApi.createCompany(companyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
};

// 채용공고 목록 조회
export const useJobPostings = () => {
  return useQuery<JobPostingResponseDto[]>({
    queryKey: ['jobPostings'],
    queryFn: jobPostingApi.getJobPostings,
  });
};

// 특정 채용공고 조회
export const useJobPosting = (id: number) => {
  return useQuery<JobPostingResponseDto>({
    queryKey: ['jobPosting', id],
    queryFn: () => jobPostingApi.getJobPosting(id),
    enabled: !!id,
  });
};


// 채용공고 생성/수정 뮤테이션
export const useJobPostingMutation = () => {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: (jobPostingData: JobPostingCreateRequestDto) => 
      jobPostingApi.createJobPosting(jobPostingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: JobPostingCreateRequestDto }) => 
      jobPostingApi.updateJobPosting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });

  return { createMutation, updateMutation };
};

// 지원서 목록 조회
export const useApplications = () => {
  return useQuery<ApplicationResponseDto[]>({
    queryKey: ['applications'],
    queryFn: applicationApi.getApplications,
  });
};

// 공고별 지원서 조회
export const useApplicationsByJobPosting = (jobPostingId: number) => {
  return useQuery<ApplicationResponseDto[]>({
    queryKey: ['applications', jobPostingId],
    queryFn: () => applicationApi.getApplicationsByJobPosting(jobPostingId),
    enabled: !!jobPostingId,
  });
};

// 지원서 통계 조회
export const useApplicationStatistics = () => {
  return useQuery({
    queryKey: ['applicationStatistics'],
    queryFn: applicationApi.getApplicationStatistics,
  });
};

// 공고별 평가 기준 조회
export const useEvaluationCriteria = (jobPostingId: number) => {
  return useQuery({
    queryKey: ['evaluationCriteria', jobPostingId],
    queryFn: () => applicationApi.getEvaluationCriteria(jobPostingId),
    enabled: !!jobPostingId,
  });
};

// 지원서 상세 정보 조회
export const useApplicationDetails = (applicationId: number) => {
  return useQuery({
    queryKey: ['applicationDetails', applicationId],
    queryFn: () => applicationApi.getApplicationDetails(applicationId),
    enabled: !!applicationId,
  });
};

// 지원서 제출 뮤테이션
export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobPostingId, applicationData }: { 
      jobPostingId: number; 
      applicationData: ApplicationCreateRequestDto 
    }) => applicationApi.submitApplication(jobPostingId, applicationData),
    onSuccess: (_, { jobPostingId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', jobPostingId] });
    },
  });
};

// 지원서 평가 저장 뮤테이션
export const useEvaluationMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ applicationId, evaluationData }: { 
      applicationId: number; 
      evaluationData: { comment: string; status: string; finalScore?: number } 
    }) => applicationApi.saveEvaluation(applicationId, evaluationData),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applicationDetails', applicationId] });
    },
  });
};

// 평가 결과 처리 뮤테이션
export const useProcessEvaluationResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (evaluationResult: any) => applicationApi.processEvaluationResult(evaluationResult),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

// 여러 워크스페이스의 지원서 데이터를 가져오는 훅
export const useMultipleApplications = (workspaceIds: number[]) => {
  const queries = workspaceIds.map(workspaceId => ({
    queryKey: ['applications', workspaceId],
    queryFn: () => applicationApi.getApplicationsByJobPosting(workspaceId),
    enabled: workspaceId > 0,
  }));

  return useQueries({
    queries,
  });
};

// Application 제출 훅
export const useApplicationSubmission = () => {
  return useMutation({
    mutationFn: ({ jobPostingId, applicationData }: { 
      jobPostingId: number; 
      applicationData: ApplicationCreateRequestDto 
    }) => applicationApi.submitApplication(jobPostingId, applicationData),
    onError: (error: any) => {
      console.error('지원서 제출 실패:', error);
      toast.error('지원서 제출에 실패했습니다. 다시 시도해주세요.');
    }
  });
};

// 지원서 평가 결과 조회
export const useApplicationEvaluationResult = (applicationId: number | null) => {
  return useQuery<EvaluationResultDto | null>({
    queryKey: ['applicationEvaluationResult', applicationId],
    queryFn: () => applicationId ? applicationApi.getApplicationEvaluationResult(applicationId) : Promise.resolve(null),
    enabled: !!applicationId,
  });
};

// 자기소개서 문항 데이터 조회
export const useCoverLetterQuestions = (applicationId: number | null) => {
  return useQuery<CoverLetterQuestionsResponse | null>({
    queryKey: ['coverLetterQuestions', applicationId],
    queryFn: () => applicationId ? applicationApi.getCoverLetterQuestions(applicationId) : Promise.resolve(null),
    enabled: !!applicationId,
  });
};

// 새로운 통합 API: 공고별 모든 데이터 조회 (지원서, 이력서, 자소서, 평가결과 포함)
export const useJobPostingWithApplications = (jobPostingId: number) => {
  return useQuery({
    queryKey: ['jobPostingWithApplications', jobPostingId],
    queryFn: () => applicationApi.getJobPostingWithApplications(jobPostingId),
    enabled: !!jobPostingId,
  });
};

// ApplicationId로 evaluationResult 조회
export const useEvaluationResultByApplicationId = (applicationId: number) => {
  return useQuery({
    queryKey: ['evaluationResult', applicationId],
    queryFn: () => applicationApi.getEvaluationResultByApplicationId(applicationId),
    enabled: !!applicationId,
    refetchOnWindowFocus: false, // 창 포커스 시 자동 재조회 비활성화
    staleTime: 0, // 데이터를 항상 fresh하게 유지
  });
};

// 유틸리티 훅들
export const useApiUtils = () => {
  return apiUtils;
};