import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User } from '../components/icons';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Card } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { signIn, signUp } from '../lib/api';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp({
        username: formData.username,
        password: formData.password,
      });
      const session = await signIn({
        username: formData.username,
        password: formData.password,
      });
      setToken(session.jwt);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account');
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
      <Card className="">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Create your account</h2>
            <p className="text-gray-400 text-center">Start monitoring your websites today</p>
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
              placeholder="Choose a username"
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
              placeholder="At least 8 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Create Account
          </Button>

          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link
              to="/login" 
              className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};
