"use client";

import { ClockIcon, GavelIcon, MoneyIcon } from '@/components/IconComponents';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Player } from '@/type/types';
import React, { useEffect, useState } from 'react';

const PlayerCard: React.FC<{ player: Player }> = ({ player }) => (
  <div className="bg-surface rounded-xl shadow-2xl overflow-hidden relative">
    <img
      src={player.actionImageURL}
      alt={`${player.name} in action`}
      className="w-full h-64 object-cover"
    />
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-6 text-white">
      <img
        src={player.profileImageURL}
        alt={player.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-primary mb-4"
      />
      <h2 className="text-4xl font-extrabold">{player.name}</h2>
      <p className="text-lg text-gray-300">
        {player.nationality} -{' '}
        <span className="font-semibold text-secondary">{player.position}</span>
      </p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface">
      <StatItem label="Batting Avg" value={player.stats.battingAverage.toFixed(2)} />
      <StatItem label="Strike Rate" value={player.stats.strikeRate.toFixed(2)} />
      <StatItem label="Wickets" value={player.stats.wickets} />
      <StatItem label="Economy" value={player.stats.economyRate.toFixed(2)} />
    </div>
  </div>
);

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="text-center bg-background p-3 rounded-lg">
    <p className="text-sm text-text-secondary">{label}</p>
    <p className="text-xl font-bold text-text-primary">{value}</p>
  </div>
);

const LiveAuctionPage: React.FC = () => {
  const {
    teams,
    unsoldPlayers,
    currentPlayerIndex,
    currentBid,
    playerBidHistory,
    timer,
    isAuctionActive,
    winningTeam,
    biddingTurnTeamId,
    startAuctionForPlayer,
    timerTick,
    loggedInAdmin,
    setBiddingTurn,
    setRandomBiddingTurn,
    placeBid,
    auctionTimerDuration,
    setAuctionTimerDuration,
    isTimerEnabled,
    setTimerEnabled,
    closeBidding,
  } = useFirebase();

  const [adminBidIncrements, setAdminBidIncrements] = useState<{ [teamId: string]: string }>({});
  const [bidError, setBidError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      timerTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [timerTick]);

  const handleAdminBid = (teamId: string) => {
    const increment = parseInt(adminBidIncrements[teamId] || '0', 10);
    const result = placeBid(teamId, increment);
    if (!result.success) {
      setBidError(result.message);
      setTimeout(() => setBidError(null), 3000);
    } else {
      setBidError(null);
      setAdminBidIncrements(prev => ({ ...prev, [teamId]: '' })); // clear input on success
    }
  };

  const currentPlayer = unsoldPlayers[currentPlayerIndex];
  const highestBidder = teams.find(t => t.id === currentBid?.teamId);
  const biddingTurnTeam = teams.find(t => t.id === biddingTurnTeamId);

  const getStatusMessage = () => {
    if (winningTeam) return <p className="text-lg font-bold text-green-400">SOLD to {winningTeam.name}!</p>;
    if (!isAuctionActive && playerBidHistory.length > 0)
      return <p className="text-lg font-bold text-yellow-400">UNSOLD</p>;
    if (!isAuctionActive && !winningTeam)
      return <p className="text-lg font-bold text-gray-400">Ready to Start</p>;
    if (isAuctionActive && biddingTurnTeam)
      return <p className="text-lg font-bold text-yellow-400">{biddingTurnTeam.name}'s Turn</p>;
    if (isAuctionActive && !biddingTurnTeamId)
      return <p className="text-lg font-bold text-cyan-400">Selecting next bidder...</p>;
    return <p className="text-lg font-bold text-gray-400">Waiting...</p>;
  };

  if (unsoldPlayers.length === 0) {
    return <div className="text-center text-2xl font-bold">Auction queue is empty. Add players from the Manage Players page.</div>;
  }

  if (!currentPlayer) {
    return <div className="text-center text-xl font-bold">Waiting for next player...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <PlayerCard player={currentPlayer} />

        <div className="bg-surface p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Bidding Arena</h3>
          <div className="flex flex-col md:flex-row items-center justify-between bg-background p-4 rounded-lg">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-text-secondary">Current Bid</p>
              <p className="text-4xl font-bold text-primary">{(currentBid?.amount || currentPlayer.baseCoins).toLocaleString()} coins</p>
              <p className="text-sm text-text-secondary">{currentBid ? `by ${highestBidder?.name}` : 'Base Coins'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <ClockIcon className={`w-8 h-8 ${isTimerEnabled ? 'text-secondary' : 'text-gray-500'}`} />
              <p
                className={`text-5xl font-mono font-bold ${
                  timer < 10 && timer > 0 ? 'text-red-500 animate-pulse' : 'text-white'
                } ${!isTimerEnabled && 'opacity-50'}`}
              >
                {timer}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              {getStatusMessage()}
              {loggedInAdmin && isAuctionActive && (
                <button
                  onClick={closeBidding}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                >
                  Close Bidding
                </button>
              )}
            </div>
          </div>
          {bidError && (
            <p className="text-center text-red-500 font-semibold mt-2 bg-red-500/10 p-2 rounded-lg">{bidError}</p>
          )}
        </div>
        {loggedInAdmin && !isAuctionActive && unsoldPlayers.length > 0 && (
          <div className="bg-surface p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <label htmlFor="timer-set" className="text-text-secondary font-semibold">
                  Timer (s):
                </label>
                <input
                  id="timer-set"
                  type="number"
                  value={auctionTimerDuration}
                  onChange={(e) => setAuctionTimerDuration(parseInt(e.target.value))}
                  className="w-20 bg-background text-white rounded p-2 border border-gray-600"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="timer-toggle" className="text-text-secondary font-semibold">
                  Enable Timer:
                </label>
                <button
                  onClick={() => setTimerEnabled(!isTimerEnabled)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    isTimerEnabled ? 'bg-secondary' : 'bg-gray-600'
                  }`}
                  aria-pressed={isTimerEnabled}
                  aria-label="Toggle timer"
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      isTimerEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <button
              onClick={startAuctionForPlayer}
              className="w-full sm:w-auto bg-secondary text-white font-bold p-4 rounded-lg text-xl hover:bg-emerald-600 transition-colors duration-200"
            >
              Start Bidding for {currentPlayer.name}
            </button>
          </div>
        )}
        {loggedInAdmin && isAuctionActive && !biddingTurnTeamId && !winningTeam && (
          <div className="bg-surface p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Admin Control: Select First Bidder</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setBiddingTurn(team.id)}
                  className="bg-primary/80 hover:bg-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {team.name}
                </button>
              ))}
              <button
                onClick={setRandomBiddingTurn}
                className="md:col-span-3 bg-secondary hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Random Select
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-surface p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Teams</h3>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`bg-background p-3 rounded-lg border-2 ${
                  biddingTurnTeamId === team.id ? 'border-yellow-400' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={team.logoURL} alt={team.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold">{team.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-text-secondary">
                        <span className="flex items-center">
                          <MoneyIcon className="w-3 h-3 mr-1" />
                          {team.coins.toLocaleString()} coins
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {team.players.length}
                  </span>
                </div>
                {loggedInAdmin && isAuctionActive && (
                  <div className="flex items-center justify-end mt-2 space-x-1">
                    <input
                      type="number"
                      step={10000}
                      className="w-28 bg-gray-800 text-white rounded p-1 text-xs"
                      placeholder="Increment Amount"
                      value={adminBidIncrements[team.id] || ''}
                      onChange={(e) =>
                        setAdminBidIncrements((prev) => ({ ...prev, [team.id]: e.target.value }))
                      }
                    />
                    <button
                      onClick={() => handleAdminBid(team.id)}
                      className="bg-primary/80 hover:bg-primary text-white font-semibold text-xs py-1 px-2 rounded-lg transition-colors flex items-center"
                    >
                      <GavelIcon className="w-3 h-3 mr-1" /> Bid
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Bid History (Current Player)</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {playerBidHistory.length === 0 && (
              <p className="text-text-secondary text-center">No bids yet.</p>
            )}
            {playerBidHistory.map((bid) => {
              const team = teams.find((t) => t.id === bid.teamId);
              return (
                <li
                  key={bid.id}
                  className="flex justify-between items-center bg-background p-2 rounded-md text-sm"
                >
                  <span className="font-semibold text-text-primary">{team?.name}</span>
                  <span className="font-mono text-secondary">{bid.amount.toLocaleString()} coins</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveAuctionPage;
