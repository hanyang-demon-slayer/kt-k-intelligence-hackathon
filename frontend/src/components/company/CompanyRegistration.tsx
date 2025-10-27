import React, { useState } from 'react';
import { Building2, CheckCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/FormInputs';
import { Label } from '../ui/label';
import { FormCard, LoadingButton, PageHeader, InfoCard, SuccessCard } from '../ui/CustomComponents';
import { useCreateCompany } from '../../hooks/useApi';

interface CompanyRegistrationProps {
  onComplete?: () => void;
}

const CompanyRegistration: React.FC<CompanyRegistrationProps> = ({ onComplete }) => {
  const [companyName, setCompanyName] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const createCompanyMutation = useCreateCompany();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCompanyMutation.mutateAsync({ name: companyName });
      toast.success('기업 등록이 완료되었습니다!');
      setIsCompleted(true);
      onComplete?.();
    } catch (error) {
      console.error('기업 등록 실패:', error);
      toast.error('기업 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <SuccessCard
            title="등록 완료!"
            message={`${companyName} 기업 등록이 성공적으로 완료되었습니다.`}
            buttonText="대시보드로 이동"
            onButtonClick={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          icon={<Building2 className="w-8 h-8 text-blue-600" />}
          title="기업 등록"
          description="채용 시스템을 사용하기 위해 기업 정보를 등록해주세요."
        />

        <form onSubmit={handleSubmit}>
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
              isLoading={createCompanyMutation.isPending}
              loadingText="등록 중..."
              normalText="기업 등록하기"
              icon={<CheckCircle className="w-5 h-5" />}
              disabled={!companyName}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-lg"
            />
          </div>
        </form>

        <InfoCard
          icon={<Calendar className="w-4 h-4 text-blue-600" />}
          title="등록 안내"
          description="회사명만 입력하면 채용공고 작성을 시작할 수 있습니다."
        />
      </div>
    </div>
  );
};

export default CompanyRegistration;