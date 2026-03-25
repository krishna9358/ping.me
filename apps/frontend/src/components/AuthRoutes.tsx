import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
