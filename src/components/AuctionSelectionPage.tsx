"use client";
import React, { useState, useMemo } from 'react';
// FIX: Replaced useMockData with useFirebase from the context.
import { useFirebase } from '@/app/contexts/FirebaseContext';
import PlayerFilters, { Filters } from './PlayerFilters';

const AuctionSelectionPage: React.FC = () => {
  // FIX: Replaced useMockData with useFirebase from the context.
  const { players, soldPlayerIds, unsoldPlayers: auctionQueue, addPlayersToAuction } = useFirebase();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({ position: 'All', nationality: '', maxBaseCoins: 2000000 });

  const availablePlayers = useMemo(() => {
    const playersInQueueIds = new Set(auctionQueue.map(p => p.id));
    return players
      .filter(p => !soldPlayerIds.includes(p.id) && !playersInQueueIds.has(p.id))
      .filter(player => {
        const positionMatch = filters.position === 'All' || player.position === filters.position;
        const nationalityMatch = player.nationality.toLowerCase().includes(filters.nationality.toLowerCase());
        const priceMatch = player.baseCoins <= filters.maxBaseCoins;
        return positionMatch && nationalityMatch && priceMatch;
      });
  }, [players, soldPlayerIds, auctionQueue, filters]);


  const handleTogglePlayerSelection = (playerId: string) => {
    setSelectedPlayerIds(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };
  
  const handleAddSelectedToAuction = () => {
      if (selectedPlayerIds.length > 0) {
          addPlayersToAuction(selectedPlayerIds);
          alert(`${selectedPlayerIds.length} player(s) added to the auction queue.`);
          setSelectedPlayerIds([]);
      }
  }

  return (
    <div className="max-w-7xl mx-auto bg-surface p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Select Players for Auction</h1>
              <p className="text-text-secondary">Choose from players who are not sold and not already in the auction queue.</p>
            </div>
              <button onClick={handleAddSelectedToAuction} disabled={selectedPlayerIds.length === 0} className="bg-secondary hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Add to Auction ({selectedPlayerIds.length})
              </button>
        </div>
        <PlayerFilters filters={filters} setFilters={setFilters} maxPriceLimit={2000000} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {availablePlayers.map(player => (
            <div 
              key={player.id} 
              className={`bg-background rounded-lg overflow-hidden group cursor-pointer border-2 transition-all ${selectedPlayerIds.includes(player.id) ? 'border-primary scale-105' : 'border-transparent'}`} 
              onClick={() => handleTogglePlayerSelection(player.id)}
            >
                <img src={player.profileImageURL} alt={player.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                    <h3 className="font-bold truncate">{player.name}</h3>
                    <p className="text-sm text-text-secondary">{player.nationality}</p>
                    <p className="text-sm text-secondary font-semibold">{player.position}</p>
                </div>
            </div>
            ))}
            {availablePlayers.length === 0 && (
                <p className="col-span-full text-center py-8 text-text-secondary">No matching players found.</p>
            )}
        </div>
    </div>
  );
};

export default AuctionSelectionPage;