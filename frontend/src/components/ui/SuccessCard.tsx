import React from 'react';
import { Card, CardContent } from './card';
import { CheckCircle } from 'lucide-react';
import { Button } from './button';

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
