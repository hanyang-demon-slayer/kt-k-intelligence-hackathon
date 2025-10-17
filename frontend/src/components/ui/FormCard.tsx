import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

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
