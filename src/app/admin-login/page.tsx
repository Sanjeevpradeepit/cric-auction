"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/contexts/FirebaseContext';

const AdminLoginPage: React.FC = () => {
  const [username] = useState('superadmin@auction.com'); // Fixed username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useFirebase();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username !== 'superadmin@auction.com') {
      setError('Invalid username. Must be "superadmin".');
      return;
    }
    const success = await adminLogin(password);
    if (success) {
      setError('');
      router.push('/dashboard/admin'); // Navigate to admin dashboard route
    } else {
      setError('Invalid password.');
    }
  };



  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2 text-text-primary">Super Admin Login</h1>
        <p className="text-center text-text-secondary mb-8">Access the administrative dashboard.</p>

        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-secondary mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              readOnly
              className="w-full px-4 py-2 border border-gray-600 rounded-lg"
            />
            <p className="text-xs text-text-secondary mt-1">Admin email is superadmin@auction.com</p>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 hover:scale-105"
          >
            Login
          </button>
           <p className="text-center text-text-secondary text-xs mt-4">
          Don't have an account? Go to{' '}
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:underline"
          >
            Home
          </button>
        </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
