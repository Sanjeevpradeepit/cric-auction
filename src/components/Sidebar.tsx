"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Page } from '../type/types';
import { useFirebase } from '@/contexts/FirebaseContext';
import { BatIcon } from './IconComponents';
import Image from 'next/image';

const Sidebar: React.FC = () => {
  const { loggedInTeamId, loggedInAdmin } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();

  const getNavLinks = () => {
    if (loggedInAdmin) {
      return [
        { page: 'admin-dashboard' as Page, label: 'Dashboard', href: '/dashboard/admin' },
        { page: 'live-auction' as Page, label: 'Auction Control', href: '/dashboard/admin/live-auction' },
        { page: 'teams' as Page, label: 'Manage Teams', href: '/dashboard/admin/teams' },
        // { page: 'add-team' as Page, label: 'Create New Team', href: '/dashboard/admin/add-team' },
        { page: 'players' as Page, label: 'Manage Players', href: '/dashboard/admin/players' },
        // { page: 'add-player' as Page, label: 'Add New Player', href: '/dashboard/admin/add-player' },
        { page: 'auction-selection' as Page, label: 'Select for Auction', href: '/dashboard/admin/auction/selection' },
        { page: 'unsold-players' as Page, label: 'Unsold Players', href: '/dashboard/admin/unsold-players' },
        { page: 'sold-players' as Page, label: 'Sold Players', href: '/dashboard/admin/sold-players' },
        { page: 'sold-players' as Page, label: 'Owners', href: '/dashboard/owners-management' },
      ];
    }
    if (loggedInTeamId) {
      return []; // No nav links for team dashboard view
    }
    // Public links
    return [
      { page: 'home' as Page, label: 'Home', href: '/' },
      { page: 'live-auction' as Page, label: 'Live Auction', href: '/live-auction' },
      { page: 'teams' as Page, label: 'View Teams', href: '/teams' },
      { page: 'sold-players' as Page, label: 'Sold Players', href: '/sold-players' },
    ];
  };

  const navLinks = getNavLinks();

  // Determine if nav link is active by pathname
  const isActive = (href: string) => pathname === href;

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const onLogoClick = () => {
    router.push(loggedInAdmin ? '/dashboard/admin' : '/');
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-surface text-white z-50 shadow-lg">
      <div className="p-4">
        <div
          className="flex-shrink-0 text-white flex items-center gap-2 cursor-pointer mb-8"
          onClick={onLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onLogoClick();
          }}
          aria-label="Go to home"
        >
          <BatIcon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">
            <Image
              src="https://pgcdigital.ai/wp-content/uploads/2023/06/OG-PGCpng-1.png"
              alt="PGC Digital Logo"
              width={100}
              height={40}
              priority
            />
          </span>
        </div>
        <nav className="space-y-2">
          {navLinks.map(({ label, href }) => (
            <button
              key={href}
              type="button"
              onClick={() => handleNavigate(href)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block ${
                isActive(href) ? 'bg-primary text-white' : 'text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
