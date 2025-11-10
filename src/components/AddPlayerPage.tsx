"use client";
import React, { useState } from 'react';
import { Page, Player } from '../type/types';
import { ArrowLeftIcon } from './IconComponents';
import { useFirebase } from '@/app/contexts/FirebaseContext';

interface AddPlayerPageProps {
  setCurrentPage: (page: Page) => void;
}

const AddPlayerPage: React.FC<AddPlayerPageProps> = ({ setCurrentPage }) => {
  const { addPlayer } = useFirebase();
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id' | 'stats'>>({
    name: '',
    nationality: '',
    position: 'Batsman',
    baseCoins: 50000,
    profileImageURL: '',
    actionImageURL: '',
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [actionFile, setActionFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPlayer(prev => ({ ...prev, [name]: name === 'baseCoins' ? parseInt(value) : value }));
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name.trim() || !newPlayer.nationality.trim()) {
      alert('Player Name and Nationality are required.');
      return;
    }
    const playerToAdd = {
      ...newPlayer,
      stats: { // Mock stats for simplicity
        battingAverage: Math.floor(Math.random() * 50) + 10,
        strikeRate: Math.floor(Math.random() * 80) + 80,
        wickets: Math.floor(Math.random() * 100),
        economyRate: Math.random() * 5 + 4,
      },
    };
    await addPlayer(playerToAdd, profileFile || undefined, actionFile || undefined);
    alert('Player added successfully!');
    setCurrentPage('players');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
        <button onClick={() => setCurrentPage('players')} className="flex items-center space-x-2 text-primary hover:underline mb-4">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Player Management</span>
        </button>
        <div className="bg-surface p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-2">Add New Player</h1>
          <p className="text-center text-text-secondary mb-8">Enter the details for the new player.</p>
          <form onSubmit={handleAddPlayer} className="space-y-4">
            <input name="name" value={newPlayer.name} onChange={handleChange} placeholder="Player Name" className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition" required />
            <input name="nationality" value={newPlayer.nationality} onChange={handleChange} placeholder="Nationality" className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition" required />
            <select name="position" value={newPlayer.position} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition">
              <option>Batsman</option>
              <option>Bowler</option>
              <option>All-Rounder</option>
              <option>Wicketkeeper</option>
            </select>
            <div>
              <label className="text-sm text-text-secondary">Base Coins: {newPlayer.baseCoins.toLocaleString()} coins</label>
              <input name="baseCoins" type="range" min="10000" max="2000000" step="10000" value={newPlayer.baseCoins} onChange={handleChange} className="w-full" />
            </div>
             <div>
                <label className="text-sm text-text-secondary">Profile Image</label>
                <input type="file" onChange={(e) => e.target.files && setProfileFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
             </div>
             <div>
                <label className="text-sm text-text-secondary">Action Image</label>
                <input type="file" onChange={(e) => e.target.files && setActionFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
             </div>
            <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105">Save Player</button>
          </form>
      </div>
    </div>
  );
};
export default AddPlayerPage;
