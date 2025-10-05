// 직무 형태 관련 유틸리티 함수들
import { EmploymentType } from '../services/api';

/**
 * 직무 형태를 한국어로 변환
 */
export const getEmploymentTypeLabel = (employmentType: EmploymentType | string): string => {
  switch (employmentType) {
    case 'FULL_TIME':
      return '정규직';
    case 'PART_TIME':
      return '파트타임';
    case 'CONTRACT':
      return '계약직';
    case 'INTERNSHIP':
      return '인턴십';
    case 'FREELANCE':
      return '프리랜서';
    default:
      return '정규직'; // 기본값
  }
};

/**
 * 직무 형태를 색상으로 구분
 */
export const getEmploymentTypeColor = (employmentType: EmploymentType | string): string => {
  switch (employmentType) {
    case 'FULL_TIME':
      return 'bg-blue-100 text-blue-800';
    case 'PART_TIME':
      return 'bg-green-100 text-green-800';
    case 'CONTRACT':
      return 'bg-yellow-100 text-yellow-800';
    case 'INTERNSHIP':
      return 'bg-purple-100 text-purple-800';
    case 'FREELANCE':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * 직무 형태 옵션 목록
 */
export const employmentTypeOptions = [
  { value: 'FULL_TIME', label: '정규직' },
  { value: 'PART_TIME', label: '파트타임' },
  { value: 'CONTRACT', label: '계약직' },
  { value: 'INTERNSHIP', label: '인턴십' },
  { value: 'FREELANCE', label: '프리랜서' },
];
