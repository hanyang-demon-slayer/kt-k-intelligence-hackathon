// Company Registration 관련 타입 정의

export interface CompanyRegistrationProps {
  onComplete?: () => void;
}

export interface CompanyFormData {
  name: string;
}

export interface CompanyRegistrationFormProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export interface CompanyRegistrationSuccessProps {
  companyName: string;
}
