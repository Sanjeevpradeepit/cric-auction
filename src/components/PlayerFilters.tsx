import React from 'react';
import { Player } from '../type/types';

export interface Filters {
  position: 'All' | Player['position'];
  nationality: string;
  maxBaseCoins: number;
}

interface PlayerFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  maxPriceLimit: number;
}

const PlayerFilters: React.FC<PlayerFiltersProps> = ({ filters, setFilters, maxPriceLimit }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: name === 'maxBaseCoins' ? parseInt(value) : value }));
  };

  return (
    <div className="bg-surface p-4 rounded-xl shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-text-secondary mb-1">Position</label>
          <select 
            id="position"
            name="position" 
            value={filters.position} 
            onChange={handleFilterChange}
            className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="All">All Positions</option>
            <option>Batsman</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicketkeeper</option>
          </select>
        </div>
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-text-secondary mb-1">Nationality</label>
          <input
            id="nationality"
            name="nationality"
            type="text"
            value={filters.nationality}
            onChange={handleFilterChange}
            placeholder="e.g., Indian"
            className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="maxBaseCoins" className="block text-sm font-medium text-text-secondary mb-1">
            Max Base Coins: {filters.maxBaseCoins.toLocaleString()} coins
          </label>
          <input
            id="maxBaseCoins"
            name="maxBaseCoins"
            type="range"
            min="10000"
            max={maxPriceLimit}
            step="10000"
            value={filters.maxBaseCoins}
            onChange={handleFilterChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerFilters;