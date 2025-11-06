"use client";
import PlayerFilters, { Filters } from '@/components/PlayerFilters';
import { useFirebase } from '@/contexts/FirebaseContext';
import React, { useState, useMemo } from 'react';
// FIX: Replaced useMockData with useFirebase from the context.

interface SoldPlayersPageProps {
  onViewPlayer: (playerId: string) => void;
}

const SoldPlayersPage: React.FC<SoldPlayersPageProps> = ({ onViewPlayer }) => {
  // FIX: Replaced useMockData with useFirebase from the context.
  const { teams, players, bids } = useFirebase();
  const [filters, setFilters] = useState<Filters>({ position: 'All', nationality: '', maxBaseCoins: 20000000 });

  // FIX: Derived soldPlayerIds from teams data.
  const soldPlayerIds = useMemo(() => teams.flatMap(t => t.players.map(p => p.id)), [teams]);


  const soldPlayersData = useMemo(() => {
    return soldPlayerIds.map(playerId => {
      const player = players.find(p => p.id === playerId);
      const winningTeam = teams.find(t => t.players.some(p => p.id === playerId));
      const winningBid = bids
        .filter(b => b.playerId === playerId)
        .sort((a, b) => b.amount - a.amount)[0];
  
      return { player, winningTeam, winningBid };
    }).filter(item => {
      if (!item.player) return false;
      const { player } = item;
      const positionMatch = filters.position === 'All' || player.position === filters.position;
      const nationalityMatch = player.nationality.toLowerCase().includes(filters.nationality.toLowerCase());
      const priceMatch = (item.winningBid?.amount || player.baseCoins) <= filters.maxBaseCoins;
      return positionMatch && nationalityMatch && priceMatch;
    });
  }, [soldPlayerIds, players, teams, bids, filters]);


  return (
    <div className="max-w-7xl mx-auto bg-surface p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sold Players ({soldPlayersData.length})</h1>
      </div>
      
      <PlayerFilters filters={filters} setFilters={setFilters} maxPriceLimit={20000000} />

      {soldPlayersData.length === 0 ? (
        <p className="text-text-secondary text-center py-8">No matching sold players found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {soldPlayersData.map(({ player, winningTeam, winningBid }) => player && (
            <div 
              key={player.id} 
              className="bg-background rounded-lg overflow-hidden group relative transition-all" 
            >
              <div onClick={() => onViewPlayer(player.id)} className="cursor-pointer">
                <img src={player.profileImageURL} alt={player.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <h3 className="font-bold truncate">{player.name}</h3>
                   {winningTeam && winningBid ? (
                     <div className="text-xs text-text-secondary mt-1">
                        <p>Sold to:</p>
                        <div className="flex items-center space-x-1 font-semibold">
                            <img src={winningTeam.logoURL} className="w-4 h-4 rounded-full"/>
                            <span>{winningTeam.name}</span>
                        </div>
                        <p className="font-mono text-secondary mt-1">{winningBid.amount.toLocaleString()} coins</p>
                     </div>
                   ) : (
                     <p className="text-xs text-red-400">Data error</p>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoldPlayersPage;