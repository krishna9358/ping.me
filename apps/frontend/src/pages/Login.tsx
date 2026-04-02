import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, User } from "../components/icons";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { signIn } from "../lib/api";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn({
        username: formData.username,
        password: formData.password,
      });
      setToken(res.jwt);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthLayout>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Welcome back
            </h2>
            <p className="text-gray-400 text-center">
              Sign in to your account to continue
            </p>
          </div>

          {error ? (
            <p className="text-sm text-red-400 text-center bg-red-950/40 border border-red-800/60 rounded-lg py-2 px-3">
              {error}
            </p>
          ) : null}

          <div className="space-y-4">
            <Input
              type="text"
              name="username"
              label="Username"
              placeholder="Your username"
              icon={User}
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Sign In
          </Button>

          <div className="text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};
