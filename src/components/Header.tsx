"use client";

import React from 'react';
import { BatIcon } from './IconComponents';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/contexts/FirebaseContext';

const Header: React.FC = () => {
  const { loggedInTeamId, loggedInAdmin, logout } = useFirebase();
  const isLoggedIn = loggedInAdmin || !!loggedInTeamId;
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Redirect after logout
    router.push(loggedInAdmin ? '/admin-login' : '/login');
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo for public or logged-out users */}
          <div className="flex items-center">
  
              <div
                className="flex-shrink-0 text-white flex items-center gap-2 cursor-pointer"
                onClick={goToHome}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') goToHome();
                }}
                aria-label="Go to home"
              >
                <BatIcon className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">
                  <Image
                    src="https://pgcdigital.ai/wp-content/uploads/2023/06/OG-PGCpng-1.png"
                    alt="PGC Digital Logo"
                    width={100}
                    height={40}  // reasonable height
                    priority
                  />
                </span>
              </div>

          </div>

          {/* Right-side controls */}
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
              >
                {loggedInAdmin ? 'Admin Logout' : 'Logout'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/admin-login')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
                >
                  Admin Login
                </button>
                {/* Uncomment to enable Team Login */}
                
                <button
                  onClick={() => router.push('/login')}
                  className="bg-secondary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
                >
                  Team Login
                </button>
               
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
