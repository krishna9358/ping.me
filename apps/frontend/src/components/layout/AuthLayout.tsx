import React from "react";
import { Activity } from "../icons";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative bg-background flex items-center justify-center px-4 selection:bg-primary/30">
      <div className="max-w-md w-full relative">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 shadow-lg shadow-primary/30">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ping.me</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your websites with confidence
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
