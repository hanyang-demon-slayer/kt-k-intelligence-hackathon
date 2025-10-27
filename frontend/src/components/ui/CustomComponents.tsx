import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { CheckCircle } from 'lucide-react';

// FormCard 컴포넌트
interface FormCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  icon,
  children,
  className = "max-w-md mx-auto"
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
};

// InfoCard 컴포넌트
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  description,
  className = "mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto",
  iconClassName = "w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
}) => {
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <div className={iconClassName}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-blue-900 mb-1">{title}</h3>
          <p className="text-sm text-blue-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

// SuccessCard 컴포넌트
interface SuccessCardProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
  buttonClassName?: string;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({
  title,
  message,
  buttonText,
  onButtonClick,
  buttonClassName = "w-full bg-blue-600 hover:bg-blue-700"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button 
              onClick={onButtonClick}
              className={buttonClassName}
            >
              {buttonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// PageHeader 컴포넌트
interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  description,
  iconClassName = "w-16 h-16 bg-blue-100 rounded-full",
  titleClassName = "text-3xl font-bold text-gray-900 mb-2",
  descriptionClassName = "text-gray-600"
}) => {
  return (
    <div className="text-center mb-8">
      <div className={`inline-flex items-center justify-center ${iconClassName} mb-4`}>
        {icon}
      </div>
      <h1 className={titleClassName}>{title}</h1>
      <p className={descriptionClassName}>{description}</p>
    </div>
  );
};

// LoadingButton 컴포넌트
interface LoadingButtonProps {
  isLoading: boolean;
  loadingText: string;
  normalText: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  normalText,
  icon,
  disabled,
  className,
  onClick,
  type = 'button'
}) => {
  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      className={className}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {normalText}
        </>
      )}
    </Button>
  );
};
