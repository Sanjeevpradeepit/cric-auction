"use client";

import { EditIcon, EyeIcon, TrashIcon } from '@/components/IconComponents';
import Modal from '@/components/Modal';
import { useFirebase } from '@/contexts/FirebaseContext';
import React, { useState, useEffect } from 'react';

const TeamManagementPage: React.FC = () => {
  const { teams, loggedInAdmin, updateTeam, deleteTeam } = useFirebase();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editedTeamData, setEditedTeamData] = useState<Partial<Team> & { owners?: Owner[] }>({});

  useEffect(() => {
    if (editingTeam) {
      setEditedTeamData(editingTeam);
    } else {
      setEditedTeamData({});
    }
  }, [editingTeam]);

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditedTeamData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleOwnerChange = (index: number, field: 'name' | 'role', value: string) => {
    const updatedOwners = [...(editedTeamData.owners || [])];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    setEditedTeamData(prev => ({ ...prev, owners: updatedOwners }));
  };

  const addOwner = () => {
    const newOwner: Owner = { id: `owner-${Date.now()}`, name: '', role: '' };
    setEditedTeamData(prev => ({
      ...prev,
      owners: [...(prev.owners || []), newOwner],
    }));
  };

  const removeOwner = (index: number) => {
    setEditedTeamData(prev => ({
      ...prev,
      owners: prev.owners?.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      deleteTeam(teamId);
    }
  };

  const handleOpenEditModal = (team: Team) => {
    setEditingTeam(team);
  };

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam && editedTeamData.name?.trim()) {
      updateTeam(editingTeam.id, editedTeamData);
      setEditingTeam(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-surface p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold">Existing Teams ({teams.length})</h2>
          {loggedInAdmin && (
            <button
              onClick={() => setEditingTeam({} as Team)} // You can set to empty or navigate to add team page
              className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
            >
              Create New Team
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map(team => (
            <div
              key={team.id}
              className="bg-background p-4 rounded-lg flex flex-col items-center text-center space-y-3"
            >
              <img
                src={team.logoURL}
                alt={`${team.name} logo`}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              />
              <h3 className="font-bold text-lg">{team.name}</h3>
              <div className="text-sm text-text-secondary">
                <p>Coins: {team.coins.toLocaleString()} coins</p>
                <p>Players: {team.players.length}</p>
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => alert(`View details for ${team.name}`)} // Replace with navigation as needed
                  className="p-2 bg-gray-700 rounded-full hover:bg-secondary transition-colors"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                {loggedInAdmin && (
                  <>
                    <button
                      onClick={() => handleOpenEditModal(team)}
                      className="p-2 bg-gray-700 rounded-full hover:bg-primary transition-colors"
                      title="Edit Team"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 bg-gray-700 rounded-full hover:bg-red-500 transition-colors"
                      title="Delete Team"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!editingTeam} onClose={() => setEditingTeam(null)} title="Edit Team Details">
        <form onSubmit={handleUpdateTeam} className="space-y-4">
          <h3 className="font-semibold text-lg border-b border-gray-700 pb-2">Team Info</h3>
          <input
            name="name"
            value={editedTeamData.name || ''}
            onChange={handleEditInputChange}
            placeholder="Team Name"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />
          <input
            name="logoURL"
            value={editedTeamData.logoURL || ''}
            onChange={handleEditInputChange}
            placeholder="Logo URL"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
          />
          <div>
            <label className="text-sm text-text-secondary">Coins: {editedTeamData.coins?.toLocaleString()} coins</label>
            <input
              name="coins"
              type="range"
              min="1000000"
              max="20000000"
              step="500000"
              value={editedTeamData.coins || 0}
              onChange={handleEditInputChange}
              className="w-full"
            />
          </div>
          <input
            name="email"
            type="email"
            value={editedTeamData.email || ''}
            onChange={handleEditInputChange}
            placeholder="Login Email"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />
          <input
            name="password"
            type="text"
            value={editedTeamData.password || ''}
            onChange={handleEditInputChange}
            placeholder="New Password (optional)"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
          />

          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-semibold text-lg mb-2">Manage Owners</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(editedTeamData.owners || []).map((owner, index) => (
                <div key={owner.id} className="flex items-center space-x-2">
                  <input
                    value={owner.name}
                    onChange={(e) => handleOwnerChange(index, 'name', e.target.value)}
                    placeholder="Owner Name"
                    className="w-1/2 px-2 py-1 bg-background border border-gray-600 rounded"
                  />
                  <input
                    value={owner.role}
                    onChange={(e) => handleOwnerChange(index, 'role', e.target.value)}
                    placeholder="Role"
                    className="w-1/2 px-2 py-1 bg-background border border-gray-600 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeOwner(index)}
                    className="p-1 text-red-500 hover:text-red-400"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addOwner} className="mt-2 text-sm text-primary hover:underline">
              + Add Owner
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setEditingTeam(null)}
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

export default TeamManagementPage;
