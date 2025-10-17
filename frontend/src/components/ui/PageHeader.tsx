import React from 'react';

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
