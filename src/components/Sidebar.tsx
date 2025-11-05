import React from 'react';
import { Page } from '../../types';
// FIX: Replaced useMockData with useFirebase from the context.
import { useFirebase } from '@/app/contexts/FirebaseContext';
import { BatIcon } from './IconComponents';
import Image from 'next/image';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block ${
        isActive
          ? 'bg-primary text-white'
          : 'text-secondary hover:bg-surface hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  // FIX: Replaced useMockData with useFirebase from the context.
  const { loggedInTeamId, loggedInAdmin } = useFirebase();

  const getNavLinks = () => {
    if (loggedInAdmin) {
      return [
        { page: 'admin-dashboard' as Page, label: 'Dashboard' },
        { page: 'live-auction' as Page, label: 'Auction Control' },
        { page: 'teams' as Page, label: 'Manage Teams' },
        { page: 'add-team' as Page, label: 'Create New Team' },
        { page: 'players' as Page, label: 'Manage Players' },
        { page: 'add-player' as Page, label: 'Add New Player' },
        { page: 'auction-selection' as Page, label: 'Select for Auction' },
        { page: 'unsold-players' as Page, label: 'Unsold Players' },
        { page: 'sold-players' as Page, label: 'Sold Players' },
      ];
    }
    if (loggedInTeamId) {
      return []; // No nav links for team dashboard view
    }
    // Public links
    return [
      { page: 'home' as Page, label: 'Home' },
      { page: 'live-auction' as Page, label: 'Live Auction' },
      { page: 'teams' as Page, label: 'View Teams' },
      { page: 'sold-players' as Page, label: 'Sold Players' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-surface text-white z-50 shadow-lg">
      <div className="p-4">
        <div className="flex-shrink-0 text-white flex items-center gap-2 cursor-pointer mb-8" onClick={() => setCurrentPage(loggedInAdmin ? 'admin-dashboard' : 'home')}>
            <BatIcon className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl"><Image src="https://pgcdigital.ai/wp-content/uploads/2023/06/OG-PGCpng-1.png"   alt="PGC Digital Logo"
                  width={100}     // specify fixed width in pixels
                  height={300}    // specify fixed height in pixels
                  priority={true} // optionally preload important images
                />
                </span>
        </div>
        <nav className="space-y-2">
          {navLinks.map(link => (
            <NavLink key={link.page} page={link.page} currentPage={currentPage} setCurrentPage={setCurrentPage}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;