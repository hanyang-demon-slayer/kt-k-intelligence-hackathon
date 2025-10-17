import React from 'react';
import { Button } from './button';
import { CheckCircle } from 'lucide-react';

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
