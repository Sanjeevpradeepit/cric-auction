"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/contexts/FirebaseContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { teamLogin } = useFirebase();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await teamLogin(email, password);
    if (!success) {
      setError('Invalid email or password.');
      return;
    }
    // On success, navigate to team's dashboard
    router.push('/team-dashboard');
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2 text-text-primary">Team Login</h1>
        <p className="text-center text-text-secondary mb-8">Access your team dashboard.</p>

        {error && (
          <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., mumbai@auction.com"
              required
              className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="text-center text-text-secondary text-xs mt-4">
          Don't have an account? Go to{' '}
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:underline"
          >
            Home
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
