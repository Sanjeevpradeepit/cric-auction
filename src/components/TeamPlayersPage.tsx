import React, { useState, useMemo } from 'react';
// FIX: Replaced useMockData with useFirebase from the context.
import { useFirebase } from '@/app/contexts/FirebaseContext';
import { ArrowLeftIcon } from './IconComponents';
import { Player } from '../../types';

interface TeamPlayersPageProps {
  teamId: string;
  onBack: () => void;
  onViewPlayer: (playerId: string) => void;
}

const TeamPlayersPage: React.FC<TeamPlayersPageProps> = ({ teamId, onBack, onViewPlayer }) => {
  // FIX: Replaced useMockData with useFirebase from the context.
  const { teams } = useFirebase();
  const [filterPosition, setFilterPosition] = useState<'All' | Player['position']>('All');
  const [sortKey, setSortKey] = useState<'name' | 'baseCoins'>('name');

  const team = teams.find(t => t.id === teamId);

  const filteredAndSortedPlayers = useMemo(() => {
    if (!team) return [];
    
    return team.players
      .filter(player => filterPosition === 'All' || player.position === filterPosition)
      .sort((a, b) => {
        if (sortKey === 'name') {
          return a.name.localeCompare(b.name);
        }
        return b.baseCoins - a.baseCoins; // Sort by price descending
      });
  }, [team, filterPosition, sortKey]);

  if (!team) {
    return (
      <div>
        <button onClick={onBack} className="flex items-center space-x-2 text-primary hover:underline mb-4">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>
        <p>Team not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
           <button onClick={onBack} className="flex items-center space-x-2 text-primary hover:underline mb-2">
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Team Details</span>
            </button>
          <h1 className="text-3xl font-bold">{team.name} - Player Roster</h1>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={filterPosition} 
            onChange={e => setFilterPosition(e.target.value as any)}
            className="bg-background border border-gray-600 rounded-lg px-3 py-2"
          >
            <option value="All">All Positions</option>
            <option>Batsman</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicketkeeper</option>
          </select>
          <div className="flex items-center space-x-1 bg-background border border-gray-600 rounded-lg p-1">
            <button onClick={() => setSortKey('name')} className={`px-3 py-1 text-sm rounded ${sortKey === 'name' ? 'bg-primary' : ''}`}>Name</button>
            <button onClick={() => setSortKey('baseCoins')} className={`px-3 py-1 text-sm rounded ${sortKey === 'baseCoins' ? 'bg-primary' : ''}`}>Coins</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAndSortedPlayers.map(player => (
          <div key={player.id} className="bg-background p-4 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => onViewPlayer(player.id)}>
            <img src={player.profileImageURL} alt={player.name} className="w-16 h-16 rounded-full object-cover" />
            <div>
              <p className="font-bold text-lg">{player.name}</p>
              <p className="text-sm text-text-secondary">{player.position}</p>
              <p className="text-sm font-semibold text-secondary">{player.baseCoins.toLocaleString()} coins</p>
            </div>
          </div>
        ))}
        {team.players.length === 0 && (
          <p className="col-span-full text-center text-text-secondary py-8">This team has not acquired any players yet.</p>
        )}
      </div>
    </div>
  );
};

export default TeamPlayersPage;