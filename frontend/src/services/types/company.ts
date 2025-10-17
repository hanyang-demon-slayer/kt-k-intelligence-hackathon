// 회사 관련 타입 정의

export interface CompanyResponseDto {
  id: number;
  name: string;
}

export interface CompanyCreateRequestDto {
  name: string;
}
