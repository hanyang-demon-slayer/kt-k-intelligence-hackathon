import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateCompany } from '../../../hooks/useApi';
import { CompanyRegistrationProps } from '../types';

export const useCompanyRegistration = (onComplete?: () => void) => {
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

  return {
    companyName,
    setCompanyName,
    isCompleted,
    createCompanyMutation,
    handleSubmit,
  };
};
