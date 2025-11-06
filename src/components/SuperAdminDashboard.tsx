import React from 'react';
// FIX: Replaced useMockData with useFirebase from the context.
import { useFirebase } from '@/app/contexts/FirebaseContext';
import { BatIcon, TrophyIcon, GavelIcon } from './IconComponents';
import { Page } from '../type/types';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; }> = ({ icon, title, value }) => (
  <div className="bg-surface p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

interface SuperAdminDashboardProps {
  setCurrentPage: (page: Page) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ setCurrentPage }) => {
    // FIX: Replaced useMockData with useFirebase from the context.
    const { teams, players, bids } = useFirebase();

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
                    Super Admin Dashboard
                </h1>
                <p className="text-lg text-text-secondary">
                    Welcome, Admin. Here's a snapshot of the platform activity.
                </p>
            </section>

            <section className="grid md:grid-cols-3 gap-8">
                <StatCard 
                    icon={<TrophyIcon className="w-6 h-6" />}
                    title="Total Teams"
                    value={teams.length}
                />
                 <StatCard 
                    icon={<BatIcon className="w-6 h-6" />}
                    title="Total Players"
                    value={players.length}
                />
                 <StatCard 
                    icon={<GavelIcon className="w-6 h-6" />}
                    title="Total Bids Placed"
                    value={bids.length}
                />
            </section>

            <section className="bg-surface rounded-lg p-6">
                 <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                 <div className="flex flex-col sm:flex-row gap-4">
                     <button onClick={() => setCurrentPage('live-auction')} className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105">Go to Auction Control</button>
                     <button onClick={() => setCurrentPage('teams')} className="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105">Manage Teams</button>
                     <button onClick={() => setCurrentPage('players')} className="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg border border-gray-600 transition-colors">Manage Players</button>
                 </div>
            </section>
        </div>
    );
};

export default SuperAdminDashboard;