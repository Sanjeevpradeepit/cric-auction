
"use client";
import React, { useState } from 'react';
import { Page } from '../../../types';
import { useFirebase } from '@/app/contexts/FirebaseContext';
import PlayerDetailsPage from '@/components/PlayerDetailsPage';
import TeamDetailsPage from '@/components/TeamDetailsPage';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';
import TeamManagementPage from '@/components/TeamManagementPage';
import PlayerManagementPage from '@/components/PlayerManagementPage';
import AuctionSelectionPage from '@/components/AuctionSelectionPage';
import LiveAuctionPage from '@/components/LiveAuctionPage';
import UnsoldPlayersPage from '@/components/UnsoldPlayersPage';
import SoldPlayersPage from '@/components/SoldPlayersPage';
import AddPlayerPage from '@/components/AddPlayerPage';
import AddTeamPage from '@/components/AddTeamPage';
import TeamDashboardPage from '@/components/TeamDashboardPage';
import HomePage from '@/components/HomePage';
import LoginPage from '@/components/LoginPage';
import AdminLoginPage from '@/components/AdminLoginPage';
import CreateAuctionPage from '@/components/CreateAuctionPage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';


const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [viewingTeamId, setViewingTeamId] = useState<string | null>(null);
  const [viewingPlayerId, setViewingPlayerId] = useState<string | null>(null);
  const { loggedInTeamId, loggedInAdmin, loading } = useFirebase();

  const isLoggedIn = !!loggedInTeamId || !!loggedInAdmin;

  const handleSetCurrentPage = (page: Page) => {
    setViewingTeamId(null);
    setViewingPlayerId(null);
    setCurrentPage(page);
  };
  
  const handleViewTeam = (teamId: string) => {
    setViewingTeamId(teamId);
    setCurrentPage('teams'); // Set context for back navigation
  };

  const handleViewPlayer = (playerId: string) => {
    setViewingPlayerId(playerId);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-full text-xl">Loading...</div>;
    }
    // Highest priority views
    if (viewingPlayerId) {
      return <PlayerDetailsPage playerId={viewingPlayerId} onBack={() => setViewingPlayerId(null)} />;
    }
    if (viewingTeamId) {
      return <TeamDetailsPage teamId={viewingTeamId} onBack={() => setViewingTeamId(null)} onViewPlayer={handleViewPlayer} />;
    }

    // Role-based views
    if (loggedInAdmin) {
      switch (currentPage) {
        case 'admin-dashboard':
          return <SuperAdminDashboard setCurrentPage={handleSetCurrentPage} />;
        case 'teams':
          return <TeamManagementPage onSelectTeam={handleViewTeam} setCurrentPage={handleSetCurrentPage} />;
        case 'players':
          return <PlayerManagementPage onViewPlayer={handleViewPlayer} setCurrentPage={handleSetCurrentPage} />;
        case 'auction-selection':
          return <AuctionSelectionPage />;
        case 'live-auction':
          return <LiveAuctionPage />;
        case 'unsold-players':
          return <UnsoldPlayersPage onViewPlayer={handleViewPlayer} />;
        case 'sold-players':
          return <SoldPlayersPage onViewPlayer={handleViewPlayer}/>;
        case 'add-player':
          return <AddPlayerPage setCurrentPage={handleSetCurrentPage} />;
        case 'add-team':
          return <AddTeamPage setCurrentPage={handleSetCurrentPage} />;
        default:
          setCurrentPage('admin-dashboard');
          return <SuperAdminDashboard setCurrentPage={handleSetCurrentPage} />;
      }
    }

    if (loggedInTeamId) {
      return <TeamDashboardPage onViewPlayer={handleViewPlayer} />;
    }

    // Public views
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={handleSetCurrentPage} />;
      case 'login':
        return <LoginPage setCurrentPage={handleSetCurrentPage}/>;
      case 'admin-login':
        return <AdminLoginPage setCurrentPage={handleSetCurrentPage} />;
      case 'live-auction':
        return <LiveAuctionPage />;
      case 'teams':
        return <TeamManagementPage onSelectTeam={handleViewTeam} setCurrentPage={handleSetCurrentPage} />;
       case 'sold-players':
          return <SoldPlayersPage onViewPlayer={handleViewPlayer}/>;
      case 'create-auction':
        return <CreateAuctionPage />;
      default:
        return <HomePage setCurrentPage={handleSetCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex">
       {isLoggedIn && (
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={handleSetCurrentPage} 
        />
      )}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isLoggedIn ? 'md:ml-64' : 'ml-0'}`}>
        <Header 
          setCurrentPage={handleSetCurrentPage}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
