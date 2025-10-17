import React from 'react';
import { SuccessCard } from '../../ui/SuccessCard';
import { CompanyRegistrationSuccessProps } from '../types';

export const CompanyRegistrationSuccess: React.FC<CompanyRegistrationSuccessProps> = ({ companyName }) => {
  return (
    <SuccessCard
      title="등록 완료!"
      message={`${companyName} 기업 등록이 성공적으로 완료되었습니다.`}
      buttonText="대시보드로 이동"
      onButtonClick={() => window.location.reload()}
    />
  );
};
