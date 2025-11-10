import React from 'react';
// FIX: Replaced useMockData with useFirebase from the context.
import { ArrowLeftIcon } from './IconComponents';
import { useFirebase } from '@/contexts/FirebaseContext';

interface PlayerDetailsPageProps {
  playerId: string;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center bg-background p-4 rounded-lg">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
);

const PlayerDetailsPage: React.FC = () => {
  // FIX: Replaced useMockData with useFirebase from the context.
  const { players, teams, bids } = useFirebase();
  
  const player = players.find(p => p.id === playerId);
  const playerBids = bids.filter(b => b.playerId === playerId).sort((a,b) => b.timestamp - a.timestamp);

  const handleBack = () =>{

  }
 
  if (!player) {
    return (
      <div>
        <button onClick={handleBack} className="flex items-center space-x-2 text-primary hover:underline mb-4">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>
        <p>Player not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <button onClick={handleBack} className="flex items-center space-x-2 text-primary hover:underline mb-4">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-surface rounded-xl shadow-2xl overflow-hidden relative">
        <img src={player.actionImageURL} alt={`${player.name} in action`} className="w-full h-64 object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
            <img src={player.profileImageURL} alt={player.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary mb-4" />
            <h1 className="text-4xl font-extrabold">{player.name}</h1>
            <p className="text-lg text-gray-300">{player.nationality} - <span className="font-semibold text-secondary">{player.position}</span></p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Player Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
                <StatItem label="Base Coins" value={`${player.baseCoins.toLocaleString()} coins`} />
                <StatItem label="Batting Avg" value={player.stats.battingAverage.toFixed(2)} />
                <StatItem label="Strike Rate" value={player.stats.strikeRate.toFixed(2)} />
                <StatItem label="Wickets" value={player.stats.wickets} />
                <StatItem label="Economy" value={player.stats.economyRate.toFixed(2)} />
            </div>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Auction Bid History</h2>
             <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {playerBids.map(bid => {
                    const team = teams.find(t => t.id === bid.teamId);
                    return (
                        <div key={bid.id} className="bg-background p-3 rounded-lg text-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <img src={team?.logoURL} alt={team?.name} className="w-6 h-6 rounded-full"/>
                                    <p className="font-bold">{team?.name || 'Unknown Team'}</p>
                                </div>
                                <p className="font-mono text-secondary font-semibold">{bid.amount.toLocaleString()} coins</p>
                            </div>
                            <p className="text-xs text-text-secondary text-right">{new Date(bid.timestamp).toLocaleString()}</p>
                        </div>
                    );
                })}
                {playerBids.length === 0 && <p className="text-text-secondary">No bids were placed on this player.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsPage;