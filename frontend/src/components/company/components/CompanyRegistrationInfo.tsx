import React from 'react';
import { Calendar } from 'lucide-react';
import { InfoCard } from '../../ui/InfoCard';

export const CompanyRegistrationInfo: React.FC = () => {
  return (
    <InfoCard
      icon={<Calendar className="w-4 h-4 text-blue-600" />}
      title="등록 안내"
      description="회사명만 입력하면 채용공고 작성을 시작할 수 있습니다."
    />
  );
};
