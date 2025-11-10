
"use client"

import { ArrowLeftIcon } from '@/components/IconComponents';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useRouter } from 'next/navigation';
import React, { FunctionComponent } from 'react';
// FIX: Replaced useMockData with useFirebase from the context.

interface PlayerDetailsPageProps {
  params: { playerId: string }
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center flex items-center  bg-background p-4 rounded-lg">
        <p className="text-md text-text-secondary">{label}</p>
        <p className="text-xl capitalize font-bold text-text-primary">: {" "} {value}</p>
    </div>
);


interface StatsRowTableProps {
  data: { [key: string]: string | number | undefined };
  title: string;
}
export const StatsRowTable: FunctionComponent<StatsRowTableProps> = ({ data, title }) => {
  return (
    <div className=" overflow-y-auto overflow-y-hidden">
      <h1 className="text-2xl py-4 font-extrabold">{title}</h1>
      <table className="min-w-full text-left border border-gray-300">
      <thead>
        <tr>
          {Object.keys(data).map((label) => (
            <th key={label} className="px-4 py-2 border-b bg-gray-100">{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.values(data).map((value, idx) => (
            <td key={idx} className="px-4 py-2 border-b">{value}</td>
          ))}
        </tr>
      </tbody>
    </table>
    </div>
  );
}



const PlayerDetailsPage: React.FC<PlayerDetailsPageProps> = ({ params }) => {
  // FIX: Replaced useMockData with useFirebase from the context.
      const router = useRouter();
  const { players, teams, bids } = useFirebase();
  
  const player = players.find(p => p.id === params.playerId);
  const playerBids = bids.filter(b => b.playerId === params.playerId).sort((a,b) => b.timestamp - a.timestamp);
    const handleOnBack = () => {
    router.push(`/dashboard/admin/players`);
  };

  if (!player) {
    return (
      <div>
        <button onClick={handleOnBack} className="flex items-center space-x-2 text-primary hover:underline mb-4">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>
        <p>Player not found.</p>
      </div>
    );
  }

  console.log(player ,'players')
const battingStats = {
  Matches: player.stats.matches,
  Innings: player.stats.inns,
  Runs: player.stats.runs,
  Balls: player.stats.ballsFaced,
  Highest: player.stats.highScore,
  Average: player.stats.battingAverage,
  SR: player.stats.strikeRate,
  "Not Out": player.stats.notOuts,
  Fours: player.stats.fours,
  Sixes: player.stats.sixes,
  Ducks: 0, // optional — can be derived later
  "50s": player.stats.fifties,
  "100s": player.stats.hundreds,
  "200s": player.stats.doubleHundreds,
};

const bowlingStats = {
  Matches: player.stats.matches,
  Innings: player.stats.inns,
  BallsBowled: player.stats.ballsBowled,
  Wickets: player.stats.wickets,
  RunsConceded: player.stats.runsConceded,
  BowlingAverage: player.stats.bowlingAverage,
  EconomyRate: player.stats.economyRate,
  "5 Wicket Hauls": player.stats.fiveWicketHauls,
  "10 Wicket Hauls": player.stats.tenWicketHauls,
  "Best Bowling In Innings": player.stats.bestBowlingInInnings,
  "Best Bowling In Match": player.stats.bestBowlingInMatch,
  Catches: player.stats.catches,
  Stumpings: player.stats.stumpings,
  ByesConceded: player.stats.byesConceded,
  Dismissals: player.stats.dismissals,
  KeepingEfficiency: player.stats.keepingEfficiency,
};


console.log(battingStats)
console.log(playerBids, "playerBids")


  return (
    <div className="w-7xl space-y-8">
      <div>
        <button onClick={handleOnBack} className="flex items-center space-x-2 text-primary hover:underline mb-4">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>
       <div><h1 className="text-4xl font-extrabold capitalize">{player.name}</h1>
            <p className="text-lg text-gray-500 capitalize">{player.nationality} |  <span className="font-semibold text-secondary">{player.position}</span> | <span className="font-semibold text-secondary">{player.gender}</span> | <span className="font-semibold text-secondary">{player.age} age</span></p></div>
      

      <div className="bg-surface rounded-xl shadow-2xl overflow-hidden relative">
        <img src={player.actionImageURL} alt={`${player.name} in action`} className="w-full h-64 object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
            <img src={player.profileImageURL} alt={player.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary mb-4" />
          
        </div>
      </div>
     
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Player Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
                <StatItem label="Base Coins" value={`${player.baseCoins.toLocaleString()} coins`} />
                <StatItem label="Nickname" value={player.nickname ? `${player.nickname.toLocaleString()}` : 'N/A'}  />
                <StatItem label="Batting Style" value={`${player.battingStyle.toLocaleString()}`} />
                <StatItem label="Date of Birth" value={player?.dob ? `${player?.dob}` : 'N/A'} />
                <StatItem label="Birth Place" value={`${player.birthPlace.toLocaleString()}`} />
                <StatItem label="Batting Avg" value={player.stats.battingAverage.toFixed(2)} />
                <StatItem label="Bowling Avg" value={player.stats.bowlingAverage ? `${player.stats.bowlingAverage.toFixed(2)}` : 'N/A'}/>
                <StatItem label="Strike Rate" value={player.stats.strikeRate.toFixed(2)} />
            </div>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Auction Bid History</h2>
             <div className="space-y-2 max-h-100 overflow-y-auto pr-2">
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
      <StatsRowTable data={battingStats} title={"Batting Statistics"}/>
      <StatsRowTable data={bowlingStats} title ="Bowling Statistics"/>
    </div>
  );
};

export default PlayerDetailsPage;