"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, NewsIcon, TrophyIcon, ClockIcon } from './IconComponents';
import { useFirebase } from '@/contexts/FirebaseContext';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/50 transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-text-primary">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </div>
);

const LiveAuctionStatus: React.FC = () => {
  const { isAuctionActive, unsoldPlayers, currentPlayerIndex, timer, currentBid } = useFirebase();
  const currentPlayer = unsoldPlayers[currentPlayerIndex];

  if (!isAuctionActive || !currentPlayer) return null;

  return (
    <div className="bg-red-600/20 border border-red-500 text-white p-4 rounded-lg animate-pulse mb-8">
      <h3 className="font-bold text-lg text-center">Live Auction In Progress!</h3>
      <div className="flex justify-around items-center mt-2">
        <div>
          <p className="text-sm">Current Player</p>
          <p className="font-semibold">{currentPlayer.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-6 h-6" />
          <span className="text-2xl font-mono">{timer}s</span>
        </div>
        <div>
          <p className="text-sm">Current Bid</p>
          <p className="font-semibold">{(currentBid?.amount || currentPlayer.baseCoins).toLocaleString()} coins</p>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { players, teams, bids } = useFirebase();
  const featuredPlayers = players.slice(0, 4);
  const featuredTeams = teams.slice(0, 4);
  const recentBids = bids.slice(0, 5);

  const router = useRouter();

  return (
    <div className="space-y-12">
      <LiveAuctionStatus />

      <section
        className="text-center bg-surface rounded-lg p-8 md:p-16"
        style={{
          backgroundImage: `url('https://picsum.photos/1200/400?grayscale&blur=2')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-black/60 p-8 rounded-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            Welcome to Cricket Auction Pro
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary mb-8">
            The ultimate platform for dynamic, real-time cricket player auctions. Manage teams,
            discover talent, and experience the thrill of the bid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/live-auction')}
              className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 hover:scale-105"
            >
              Join Live Auction
            </button>
            <button
              onClick={() => router.push('/teams')}
              className="bg-surface hover:bg-background text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors border border-gray-600"
            >
              View Teams
            </button>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<TrophyIcon className="w-6 h-6" />}
          title="Live Bidding"
          description="Engage in thrilling, real-time auctions with instant bid updates and a dynamic interface."
        />
        <FeatureCard
          icon={<CalendarIcon className="w-6 h-6" />}
          title="Team Management"
          description="Easily create and manage your teams, track budgets, and build your dream squad."
        />
        <FeatureCard
          icon={<NewsIcon className="w-6 h-6" />}
          title="Player Profiles"
          description="Access detailed player statistics, profiles, and performance history to make informed decisions."
        />
        <FeatureCard
          icon={<TrophyIcon className="w-6 h-6" />}
          title="Admin Control"
          description="Full administrative control to manage teams, players, and the live auction flow."
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-surface rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Featured Players</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredPlayers.map((p) => (
                <div
                  key={p.id}
                  className="text-center"
                >
                  <img
                    src={p.profileImageURL}
                    alt={p.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-surface hover:border-primary transition-colors"
                  />
                  <p className="font-semibold mt-2">{p.name}</p>
                  <p className="text-sm text-text-secondary">{p.position}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-surface rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Featured Teams</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredTeams.map((t) => (
                <div
                  key={t.id}
                  className="text-center"
                >
                  <img
                    src={t.logoURL}
                    alt={t.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-surface hover:border-primary transition-colors"
                  />
                  <p className="font-semibold mt-2">{t.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Bids</h2>
          <div className="space-y-3">
            {recentBids.map((bid) => {
              const team = teams.find((t) => t.id === bid.teamId);
              const player = players.find((p) => p.id === bid.playerId);
              return (
                <div
                  key={bid.id}
                  className="bg-background p-3 rounded-lg text-sm"
                >
                  <p className="font-bold truncate">{player?.name}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <img src={team?.logoURL} className="w-4 h-4 rounded-full" />
                      <span className="text-text-secondary">{team?.name}</span>
                    </div>
                    <p className="font-mono text-secondary">{bid.amount.toLocaleString()} coins</p>
                  </div>
                </div>
              );
            })}
            {bids.length === 0 && <p className="text-text-secondary text-center">No bids placed yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
