import React from 'react';
import { CompanyRegistrationProps } from './types';
import { useCompanyRegistration } from './hooks/useCompanyRegistration';
import { CompanyRegistrationLayout } from './components/CompanyRegistrationLayout';
import { CompanyRegistrationHeader } from './components/CompanyRegistrationHeader';
import { CompanyRegistrationForm } from './components/CompanyRegistrationForm';
import { CompanyRegistrationInfo } from './components/CompanyRegistrationInfo';
import { CompanyRegistrationSuccess } from './components/CompanyRegistrationSuccess';

const CompanyRegistration: React.FC<CompanyRegistrationProps> = ({ onComplete }) => {
  const {
    companyName,
    setCompanyName,
    isCompleted,
    createCompanyMutation,
    handleSubmit,
  } = useCompanyRegistration(onComplete);

  if (isCompleted) {
    return <CompanyRegistrationSuccess companyName={companyName} />;
  }

  return (
    <CompanyRegistrationLayout>
      <CompanyRegistrationHeader />
      <CompanyRegistrationForm
        companyName={companyName}
        setCompanyName={setCompanyName}
        isLoading={createCompanyMutation.isPending}
        onSubmit={handleSubmit}
      />
      <CompanyRegistrationInfo />
    </CompanyRegistrationLayout>
  );
};

export default CompanyRegistration;
