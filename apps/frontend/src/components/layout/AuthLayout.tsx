import React from 'react';
import { Activity } from '../icons';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative bg-dark-900 flex items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-500 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500 blur-3xl rounded-full" />
      </div>
      <div className="max-w-md w-full relative">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-500 rounded-xl mb-4 shadow-lg shadow-accent-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ping.me</h1>
          <p className="text-gray-300 mt-2">Monitor your websites with confidence</p>
        </div>
        {children}
      </div>
    </div>
  );
};