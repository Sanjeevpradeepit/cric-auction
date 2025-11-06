"use client";

import { EditIcon, EyeIcon, TrashIcon } from '@/components/IconComponents';
import Modal from '@/components/Modal';
import PlayerFilters, { Filters } from '@/components/PlayerFilters';
import { useFirebase } from '@/contexts/FirebaseContext';
import React, { useState, useEffect, useMemo } from 'react';

const PlayerManagementPage: React.FC = () => {
  const { players, updatePlayer, loggedInAdmin, deletePlayer } = useFirebase();

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editedPlayerData, setEditedPlayerData] = useState<Partial<Player>>({});
  const [filters, setFilters] = useState<Filters>({
    position: 'All',
    nationality: '',
    maxBaseCoins: 2000000,
  });

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const positionMatch = filters.position === 'All' || player.position === filters.position;
      const nationalityMatch = player.nationality.toLowerCase().includes(filters.nationality.toLowerCase());
      const priceMatch = player.baseCoins <= filters.maxBaseCoins;
      return positionMatch && nationalityMatch && priceMatch;
    });
  }, [players, filters]);

  useEffect(() => {
    if (editingPlayer) {
      setEditedPlayerData(editingPlayer);
    }
  }, [editingPlayer]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedPlayerData(prev => ({
      ...prev,
      [name]: name === 'baseCoins' ? parseInt(value) : value,
    }));
  };

  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      deletePlayer(playerId);
    }
  };

  const handleUpdatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      updatePlayer(editingPlayer.id, editedPlayerData);
      setEditingPlayer(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-surface p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold">Player Database ({filteredPlayers.length})</h2>
          {loggedInAdmin && (
            <button
              onClick={() => setEditingPlayer({} as Player)} // or navigate to add-player
              className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
            >
              Add New Player
            </button>
          )}
        </div>
        <PlayerFilters filters={filters} setFilters={setFilters} maxPriceLimit={2000000} />

        {/* Player Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="relative bg-background rounded-lg overflow-hidden group">
              <div
                className="cursor-pointer border-2 border-transparent"
                onClick={() => {/* navigate or handle view */}}
              >
                <img
                  src={player.profileImageURL}
                  alt={player.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold">{player.name}</h3>
                  <p className="text-sm text-text-secondary">{player.nationality}</p>
                  <p className="text-sm text-secondary font-semibold">{player.position}</p>
                </div>
              </div>
              {loggedInAdmin && (
                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingPlayer(player)}
                    className="p-2 bg-gray-800/70 rounded-full hover:bg-primary transition-colors"
                    title="Edit"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="p-2 bg-gray-800/70 rounded-full hover:bg-red-500 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {/* navigate to details */}}
                    className="p-2 bg-gray-800/70 rounded-full hover:bg-secondary transition-colors"
                    title="Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for editing */}
      <Modal isOpen={!!editingPlayer} onClose={() => setEditingPlayer(null)} title="Edit Player Details">
        <form onSubmit={handleUpdatePlayer} className="space-y-4">
          <input
            name="name"
            value={editedPlayerData.name || ''}
            onChange={handleEditChange}
            placeholder="Player Name"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />
          <input
            name="nationality"
            value={editedPlayerData.nationality || ''}
            onChange={handleEditChange}
            placeholder="Nationality"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />
          <select
            name="position"
            value={editedPlayerData.position || 'Batsman'}
            onChange={handleEditChange}
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
          >
            <option>Batsman</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicketkeeper</option>
          </select>
          <input
            name="profileImageURL"
            value={editedPlayerData.profileImageURL || ''}
            onChange={handleEditChange}
            placeholder="Profile Image URL"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
          />
          <input
            name="actionImageURL"
            value={editedPlayerData.actionImageURL || ''}
            onChange={handleEditChange}
            placeholder="Action Image URL"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
          />

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingPlayer(null)}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-700 text-white font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlayerManagementPage;
