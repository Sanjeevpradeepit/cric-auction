"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/contexts/FirebaseContext';
import { EditIcon, EyeIcon, TrashIcon } from '@/components/IconComponents';
import { TeamManage, Team } from '@/type/types';

const TeamManagementPage: React.FC = () => {
  const { teams, loggedInAdmin, updateTeam, deleteTeam, owners} = useFirebase();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editedTeamData, setEditedTeamData] = useState<Partial<Team> & { teamManage?: TeamManage[] }>({});
  const router = useRouter();

  useEffect(() => {
    if (editingTeam) {
      setEditedTeamData(editingTeam);
    } else {
      setEditedTeamData({});
    }
  }, [editingTeam]);

  // const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type } = e.target;
  //   setEditedTeamData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
  // };

  // const handleOwnerChange = (index: number, field: 'name' | 'role', value: string) => {
  //   const updatedOwners = [...(editedTeamData.teamManage || [])];
  //   updatedOwners[index] = { ...updatedOwners[index], [field]: value };
  //   setEditedTeamData(prev => ({ ...prev, teamManage: updatedOwners }));
  // };

  // const addOwner = () => {
  //   const newOwner: TeamManage = { id: `owner-${Date.now()}`, name: '', role: '' };
  //   setEditedTeamData(prev => ({ ...prev, teamManage: [...(prev.teamManage || []), newOwner] }));
  // };

  // const removeOwner = (index: number) => {
  //   setEditedTeamData(prev => ({ ...prev, teamManage: prev.teamManage?.filter((_, i) => i !== index) }));
  // };

  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      deleteTeam(teamId);
    }
  };

  const handleOpenEditModal = (team: Team) => {
    router.push(`/dashboard/team-view/${team?.id}`);
  };

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam && editedTeamData.name?.trim()) {
      updateTeam(editingTeam.id, editedTeamData);
      setEditingTeam(null);
    }
  };

  // Navigate to team detail page on view
  const handleViewTeam = (teamId: string) => {
    router.push(`/dashboard/admin/teams/${teamId}`);
  };

  // Navigate to add team page
  const handleAddTeam = () => {
    router.push('/dashboard/admin/add-team');
  };

  console.log(owners)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-surface p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold">Existing Teams ({teams.length})</h2>
          {loggedInAdmin && (
            <button
              onClick={handleAddTeam}
              className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
            >
              Create New Team
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-background p-4 rounded-lg flex flex-col items-center text-center space-y-3">
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
                  onClick={() => handleViewTeam(team.id)}
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
    </div>
  );
};

export default TeamManagementPage;
