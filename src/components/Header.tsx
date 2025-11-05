import React from 'react';
import { Page } from '../../types';
import { BatIcon } from './IconComponents';
import { useFirebase } from '@/app/contexts/FirebaseContext';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  const { loggedInTeamId, loggedInAdmin, logout } = useFirebase();
  const isLoggedIn = loggedInAdmin || !!loggedInTeamId;

  const handleLogout = () => {
    logout();
    setCurrentPage(loggedInAdmin ? 'admin-login' : 'login');
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo for public pages */}
          <div className="flex items-center">
            {!isLoggedIn && (
               <div className="flex-shrink-0 text-white flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
                <BatIcon className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">Cricket Auction Pro</span>
              </div>
            )}
          </div>

          {/* Right-side controls (Login/Logout) */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
              >
                {loggedInAdmin ? 'Admin Logout' : 'Logout'}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage('admin-login')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
                >
                  Admin Login
                </button>
                {/* <button
                  onClick={() => setCurrentPage('login')}
                  className="bg-secondary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
                >
                  Team Login
                </button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
