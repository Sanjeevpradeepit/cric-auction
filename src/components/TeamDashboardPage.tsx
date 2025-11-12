"use client";

import React, { useEffect, useState } from 'react';
import { MoneyIcon, GavelIcon, ClockIcon } from './IconComponents';
import { useFirebase } from '@/contexts/FirebaseContext';

interface TeamDashboardPageProps {
  onViewPlayer: (playerId: string) => void;
}

const TeamDashboardPage: React.FC<TeamDashboardPageProps> = ({ onViewPlayer }) => {
  const {
    loggedInTeamId,
    teams,
    timer,
    isAuctionActive,
    unsoldPlayers,
    currentPlayerIndex,
    currentBid,
    biddingTurnTeamId,
    placeBid,
    passTurn,
    timerTick,
  } = useFirebase();

  const loggedInTeam = teams.find(t => t.id === loggedInTeamId);
  const [bidIncrement, setBidIncrement] = useState(50000);
  const [bidError, setBidError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      timerTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [timerTick]);

  const handlePlaceBid = () => {
    if (!loggedInTeam) return;
    const result = placeBid(loggedInTeam.id, bidIncrement);
    if (!result.success) {
      setBidError(result.message);
      setTimeout(() => setBidError(null), 3000);
    } else {
      setBidError(null);
      setBidIncrement(50000); // Reset increment on success
    }
  };

  const currentPlayer = unsoldPlayers[currentPlayerIndex];
  const isMyTurn = biddingTurnTeamId === loggedInTeamId;

  if (!loggedInTeam) return <p>Loading team data...</p>;

  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="bg-surface p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={loggedInTeam.logoURL}
          alt={`${loggedInTeam.name} logo`}
          className="w-24 h-24 rounded-full object-cover border-4 border-primary"
        />
        <div>
          <h1 className="text-4xl font-bold text-text-primary">{loggedInTeam.name}</h1>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center text-secondary text-lg font-semibold">
              <MoneyIcon className="w-5 h-5 mr-2" />
              <span>{loggedInTeam.coins.toLocaleString()} coins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Auction Panel */}
      {isAuctionActive && currentPlayer ? (
        <div
          className={`bg-surface p-6 rounded-xl shadow-lg border-2 ${
            isMyTurn ? 'border-yellow-400 animate-pulse' : 'border-transparent'
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            Live Auction: <span className="text-primary">{currentPlayer.name}</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between bg-background p-4 rounded-lg">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-text-secondary">Current Bid</p>
              <p className="text-4xl font-bold text-primary">
                {(currentBid?.amount || currentPlayer.baseCoins).toLocaleString()} coins
              </p>
              <p className="text-sm text-text-secondary">
                {currentBid ? `by ${teams.find(t => t.id === currentBid.teamId)?.name}` : 'Base Coins'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ClockIcon className="w-8 h-8 text-secondary" />
              <p
                className={`text-5xl font-mono font-bold ${
                  timer < 10 && timer > 0 ? 'text-red-500' : 'text-white'
                }`}
              >
                {timer}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={() => passTurn(loggedInTeam.id)}
                disabled={!isMyTurn}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pass
              </button>
              <div className="flex items-center">
                <span className="bg-gray-800 border border-gray-600 rounded-l-lg px-3 py-3 font-semibold">
                  +
                </span>
                <input
                  type="number"
                  value={bidIncrement}
                  onChange={e => setBidIncrement(Number(e.target.value))}
                  disabled={!isMyTurn}
                  step={10000}
                  min={0}
                  className="w-32 px-3 py-3 bg-gray-800 border-t border-b border-gray-600 disabled:opacity-50"
                />
                <button
                  onClick={handlePlaceBid}
                  disabled={!isMyTurn}
                  className="bg-secondary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-r-lg flex items-center transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <GavelIcon className="w-5 h-5 mr-2" /> Bid
                </button>
              </div>
            </div>
          </div>
          {isMyTurn && (
            <p className="text-center mt-4 text-yellow-400 font-semibold">
              It's your turn to bid! (First bid can be at base coins by entering 0)
            </p>
          )}
          {bidError && (
            <p className="text-center mt-4 text-red-500 font-semibold bg-red-500/10 p-2 rounded-lg">
              {bidError}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-surface p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-text-secondary">Auction is not currently active.</h2>
        </div>
      )}

      {/* Team Roster */}
      <div className="bg-surface p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Roster ({loggedInTeam.players.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loggedInTeam.players.length > 0 ? (
            loggedInTeam.players.map(player => (
              <div
                key={player.id}
                className="bg-background p-3 rounded-lg flex items-center space-x-4 cursor-pointer bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/50 transition-shadow duration-300 transform hover:-translate-y-1"
                onClick={() => onViewPlayer(player.id)}
              >
                <img
                  src={player.profileImageURL}
                  alt={player.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{player.name}</p>
                  <p className="text-sm text-text-secondary">{player.position}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-secondary col-span-full text-center">No players acquired yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDashboardPage;
