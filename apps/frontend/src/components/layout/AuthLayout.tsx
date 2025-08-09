import React from 'react';
import { Activity } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-500 rounded-xl mb-4">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">UptimeWatch</h1>
          <p className="text-gray-400 mt-2">Monitor your websites with confidence</p>
        </div>
        {children}
      </div>
    </div>
  );
};