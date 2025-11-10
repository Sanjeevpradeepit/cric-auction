"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/contexts/FirebaseContext';
import { ArrowLeftIcon } from '@/components/IconComponents';
import { Team } from '@/type/types';

const AddTeamPage: React.FC = () => {
  const { addTeam } = useFirebase();
  const router = useRouter();

  const [newTeam, setNewTeam] = useState<Omit<Team, 'id'> & { password: string }>({
    name: '',
    logoURL: '',
    coins: 10000000,
    email: '',
    password: '', // Ensures password is always a string, never undefined
    players: [],
    owners: [],
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewTeam(prev => ({
      ...prev,
      [name]: type === 'number' || name === 'coins' ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newTeam.name.trim() && newTeam.email.trim() && newTeam.password.trim()) {
      const teamData = {
        name: newTeam.name,
        logoURL: newTeam.logoURL,
        coins: newTeam.coins,
        email: newTeam.email,
        password: newTeam.password, // Your backend should handle password securely
      };

      await addTeam(teamData, logoFile || undefined);
      alert('Team created successfully!');
      router.push('/dashboard/admin/teams'); // Navigate after creation
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-secondary hover:underline mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Team Management</span>
      </button>
      <div className="bg-surface p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Create New Team</h1>
        <p className="text-center text-text-secondary mb-8">Enter the details for the new team.</p>
        <form onSubmit={handleAddTeam} className="space-y-4">
          <input
            name="name"
            value={newTeam.name}
            onChange={handleInputChange}
            placeholder="Team Name"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />
          <div>
            <label className="text-sm text-text-secondary">Logo Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary">
              Coins: {newTeam.coins.toLocaleString()} coins
            </label>
            <input
              name="coins"
              type="range"
              min="5000000"
              max="20000000"
              step="500000"
              value={newTeam.coins}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <input
            name="email"
            type="email"
            value={newTeam.email}
            onChange={handleInputChange}
            placeholder="Login Email"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />
          <input
            name="password"
            type="password"
            value={newTeam.password}
            onChange={handleInputChange}
            placeholder="Login Password"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105"
          >
            Save Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeamPage;
