// 새로운 구조화된 API 서비스 파일
// 이제 모든 API는 개별 파일로 분리되어 있습니다.
// 기존 import를 유지하기 위한 re-export 파일

// 모든 타입과 API 함수들을 직접 export
export * from './types';
export { companyApi } from './api/company';
export { jobPostingApi } from './api/jobPosting';
export { applicationApi } from './api/application';
export { apiUtils } from './utils/apiUtils';
export { api } from './config/axios';
