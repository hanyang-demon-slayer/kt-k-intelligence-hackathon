import React from 'react';

interface CompanyRegistrationLayoutProps {
  children: React.ReactNode;
}

export const CompanyRegistrationLayout: React.FC<CompanyRegistrationLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};
