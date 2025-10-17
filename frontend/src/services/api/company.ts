import { api } from '../config/axios';
import { CompanyCreateRequestDto, CompanyResponseDto } from '../types';

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
