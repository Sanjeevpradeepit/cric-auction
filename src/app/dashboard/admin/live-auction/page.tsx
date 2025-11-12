"use client";
import PlayerFilters, { Filters } from '@/components/PlayerFilters';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
// FIX: Replaced useMockData with useFirebase from the context.

const AuctionSelectionPage: React.FC = () => {
       const router = useRouter();
  // FIX: Replaced useMockData with useFirebase from the context.
  const { unsoldPlayers } = useFirebase();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);


  const handleTogglePlayerSelection = (index:number) => {
    console.log(index)

    router.push(`/dashboard/auction/${index}`);
// console.log("asdfghjk")
  };

  return (
    <div className="max-w-7xl mx-auto bg-surface p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Start Player for Auction</h1>
              {/* <p className="text-text-secondary">Choose from players who are not sold and not already in the auction queue.</p> */}
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {unsoldPlayers.map((player, index) => (
            <div 
              key={player.id} 
              className={`bg-background rounded-lg overflow-hidden group cursor-pointer border-2 transition-all ${selectedPlayerIds.includes(player.id) ? 'border-primary scale-105' : 'border-transparent'}`} 
              onClick={() => handleTogglePlayerSelection(index)}
            >
                <img src={player.profileImageURL} alt={player.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                    <h3 className="font-bold truncate">{player.name}</h3>
                    <p className="text-sm text-text-secondary">{player.nationality}</p>
                    <p className="text-sm text-secondary font-semibold">{player.position}</p>
                </div>
            </div>
            ))}
            {unsoldPlayers.length === 0 && (
                <p className="col-span-full text-center py-8 text-text-secondary">No matching players found.</p>
            )}
        </div>
    </div>
  );
};

export default AuctionSelectionPage;