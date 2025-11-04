"use client";
import React, { useState, useMemo } from 'react';
// FIX: Replaced useMockData with useFirebase from the context.
import { useFirebase } from '@/app/contexts/FirebaseContext';
import PlayerFilters, { Filters } from './PlayerFilters';

interface UnsoldPlayersPageProps {
  onViewPlayer: (playerId: string) => void;
}

const UnsoldPlayersPage: React.FC<UnsoldPlayersPageProps> = ({ onViewPlayer }) => {
  // FIX: Replaced useMockData with useFirebase from the context.
  const { finalUnsoldPlayers, reAuctionPlayers } = useFirebase();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({ position: 'All', nationality: '', maxBaseCoins: 2000000 });

  const filteredUnsoldPlayers = useMemo(() => {
    return finalUnsoldPlayers.filter(player => {
      const positionMatch = filters.position === 'All' || player.position === filters.position;
      const nationalityMatch = player.nationality.toLowerCase().includes(filters.nationality.toLowerCase());
      const priceMatch = player.baseCoins <= filters.maxBaseCoins;
      return positionMatch && nationalityMatch && priceMatch;
    });
  }, [finalUnsoldPlayers, filters]);


  const handleTogglePlayerSelection = (playerId: string) => {
    setSelectedPlayerIds(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleReAuction = () => {
    if (selectedPlayerIds.length > 0) {
      reAuctionPlayers(selectedPlayerIds);
      setSelectedPlayerIds([]);
      alert(`${selectedPlayerIds.length} player(s) have been added back to the auction queue.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-surface p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Unsold Players ({filteredUnsoldPlayers.length})</h1>
        <button
          onClick={handleReAuction}
          disabled={selectedPlayerIds.length === 0}
          className="bg-secondary hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Re-Auction Selected ({selectedPlayerIds.length})
        </button>
      </div>
      
      <PlayerFilters filters={filters} setFilters={setFilters} maxPriceLimit={2000000} />

      {filteredUnsoldPlayers.length === 0 ? (
        <p className="text-text-secondary text-center py-8">No matching unsold players found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredUnsoldPlayers.map(player => (
            <div 
              key={player.id} 
              className={`bg-background rounded-lg overflow-hidden group relative border-2 transition-all ${selectedPlayerIds.includes(player.id) ? 'border-primary scale-105' : 'border-transparent'}`} 
            >
              <div onClick={() => handleTogglePlayerSelection(player.id)} className="cursor-pointer">
                <img src={player.profileImageURL} alt={player.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <h3 className="font-bold truncate">{player.name}</h3>
                  <p className="text-sm text-text-secondary">{player.position}</p>
                  <p className="text-xs text-text-secondary">Base: {player.baseCoins.toLocaleString()} coins</p>
                </div>
              </div>
               <button onClick={() => onViewPlayer(player.id)} className="absolute top-2 right-2 text-xs bg-gray-800/70 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Details
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnsoldPlayersPage;