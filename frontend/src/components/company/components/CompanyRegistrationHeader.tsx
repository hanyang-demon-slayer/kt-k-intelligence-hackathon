import React from 'react';
import { Building2 } from 'lucide-react';
import { PageHeader } from '../../ui/PageHeader';

export const CompanyRegistrationHeader: React.FC = () => {
  return (
    <PageHeader
      icon={<Building2 className="w-8 h-8 text-blue-600" />}
      title="기업 등록"
      description="채용 시스템을 사용하기 위해 기업 정보를 등록해주세요."
    />
  );
};
