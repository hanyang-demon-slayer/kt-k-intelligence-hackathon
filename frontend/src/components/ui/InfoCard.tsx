import React from 'react';

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
