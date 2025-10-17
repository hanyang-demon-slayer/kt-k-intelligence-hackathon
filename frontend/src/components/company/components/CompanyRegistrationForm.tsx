import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Building2, CheckCircle } from 'lucide-react';
import { FormCard } from '../../ui/FormCard';
import { LoadingButton } from '../../ui/LoadingButton';
import { CompanyRegistrationFormProps } from '../types';

export const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({
  companyName,
  setCompanyName,
  isLoading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <FormCard
        title="기업 정보"
        icon={<Building2 className="w-5 h-5" />}
      >
        <div>
          <Label htmlFor="name" className="text-lg font-medium">회사명 *</Label>
          <Input
            id="name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="회사명을 입력하세요"
            required
            className="text-lg py-3"
          />
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>회사명만 입력하면 채용 시스템을 사용할 수 있습니다.</p>
          <p>추가 정보는 나중에 채용공고에서 설정할 수 있습니다.</p>
        </div>
      </FormCard>

      <div className="flex justify-center mt-8">
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="등록 중..."
          normalText="기업 등록하기"
          icon={<CheckCircle className="w-5 h-5" />}
          disabled={!companyName}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-lg"
        />
      </div>
    </form>
  );
};
