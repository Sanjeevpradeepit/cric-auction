"use client";
import {
  ArrowLeftIcon,
  EditIcon,
  MoneyIcon,
  TrashIcon,
} from "@/components/IconComponents";
import Modal from "@/components/Modal";
import PlayerFilters, { Filters } from "@/components/PlayerFilters";
import { useFirebase } from "@/contexts/FirebaseContext";
import { Owner, Team } from "@/type/types";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
// FIX: Replaced useMockData with useFirebase from the context.

interface TeamDetailsPageProps {
  params: { teamId: string };
}

const TeamDetailsPage: React.FC<TeamDetailsPageProps> = ({ params }) => {
  // FIX: Replaced useMockData with useFirebase from the context.
  const router = useRouter();
  const {
    teams,
    loggedInAdmin,
    loggedInTeamId,
    updateTeam,
    bids,
    players: allPlayers,
  } = useFirebase();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTeamData, setEditedTeamData] = useState<
    Partial<Team> & { owners?: Owner[] }
  >({});

  const [filters, setFilters] = useState<Filters>({
    position: "All",
    nationality: "",
    maxBaseCoins: 20000000,
  });

  const team = teams.find((t) => t.id === params.teamId);
  const isAuthorized = loggedInAdmin || loggedInTeamId === params.teamId;

  const teamBids = useMemo(() => {
    return bids
      .filter((b) => b.teamId === params.teamId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [bids, params.teamId]);

  const filteredPlayers = useMemo(() => {
    if (!team) return [];

    return team.players.filter((player) => {
      const positionMatch =
        filters.position === "All" || player.position === filters.position;
      const nationalityMatch = player.nationality
        .toLowerCase()
        .includes(filters.nationality.toLowerCase());
      const priceMatch = player.baseCoins <= filters.maxBaseCoins;
      return positionMatch && nationalityMatch && priceMatch;
    });
  }, [team, filters]);

  useEffect(() => {
    if (isEditModalOpen && team) {
      setEditedTeamData(team);
    }
  }, [isEditModalOpen, team]);

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditedTeamData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleOwnerChange = (
    index: number,
    field: "name" | "role",
    value: string
  ) => {
    const updatedOwners = [...(editedTeamData.owners || [])];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    setEditedTeamData((prev) => ({ ...prev, owners: updatedOwners }));
  };

  const addOwner = () => {
    const newOwner: Owner = { id: `owner-${Date.now()}`, name: "", role: "" };
    setEditedTeamData((prev) => ({
      ...prev,
      owners: [...(prev.owners || []), newOwner],
    }));
  };

  const removeOwner = (index: number) => {
    setEditedTeamData((prev) => ({
      ...prev,
      owners: prev.owners?.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (team && editedTeamData.name?.trim()) {
      updateTeam(team.id, editedTeamData);
      setIsEditModalOpen(false);
    }
  };
  const handleOnBack = () => {
    router.push(`/dashboard/admin/players`);
  };

  if (!team) {
    return (
      <div>
        <button
          onClick={handleOnBack}
          className="flex items-center space-x-2 text-primary hover:underline mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Teams</span>
        </button>
        <p>Team not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={handleOnBack}
          className="flex items-center space-x-2 text-primary hover:underline mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Team List</span>
        </button>
        <div className="bg-surface p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative">
          {isAuthorized && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-primary transition-colors"
              title="Edit Team"
            >
              <EditIcon className="w-5 h-5" />
            </button>
          )}
          <img
            src={team.logoURL}
            alt={`${team.name} logo`}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary"
          />
          <div>
            <h1 className="text-4xl font-bold text-text-primary">
              {team.name}
            </h1>
            <div className="flex items-center text-secondary text-lg font-semibold mt-1">
              <MoneyIcon className="w-5 h-5 mr-2" />
              <span>Coins Remaining: {team.coins.toLocaleString()} coins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="bg-surface p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Team Info</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-secondary">
                  Team Owners
                </h3>
                <div className="space-y-2 mt-2">
                  {team.owners.length > 0 ? (
                    team.owners.map((owner) => (
                      <div
                        key={owner.id}
                        className="bg-background p-2 rounded-lg"
                      >
                        <p className="font-bold text-sm">{owner.name}</p>
                        <p className="text-xs text-text-secondary">
                          {owner.role}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-text-secondary text-sm">
                      No owners listed.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-secondary">
                  Contact
                </h3>
                <p className="text-sm text-text-primary">{team.email}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Initial Coins</p>
                <p className="text-xl font-bold">
                  {(
                    team.coins +
                    team.players.reduce((sum, p) => sum + p.baseCoins, 0)
                  ).toLocaleString()}{" "}
                  coins
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Spent</p>
                <p className="text-xl font-bold text-red-400">
                  {team.players
                    .reduce((sum, p) => sum + p.baseCoins, 0)
                    .toLocaleString()}{" "}
                  coins
                </p>
              </div>
            </div>
          </div>
          <div className="bg-surface p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Recent Bids</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {teamBids.length > 0 ? (
                teamBids.map((bid) => {
                  const player = allPlayers.find((p) => p.id === bid.playerId);
                  return (
                    <div
                      key={bid.id}
                      className="bg-background p-3 rounded-lg text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-bold truncate">
                          {player?.name || "Unknown Player"}
                        </p>
                        <p className="font-mono text-secondary">
                          {bid.amount.toLocaleString()} coins
                        </p>
                      </div>
                      <p className="text-xs text-text-secondary text-right">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-text-secondary">
                  No bids placed by this team yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface p-6 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">
              Player Roster ({filteredPlayers.length})
            </h1>
          </div>
          <PlayerFilters
            filters={filters}
            setFilters={setFilters}
            maxPriceLimit={20000000}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-background p-4 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-800 transition-colors"
                // onClick={() => onViewPlayer(player.id)}
              >
                <img
                  src={player.profileImageURL}
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-lg">{player.name}</p>
                  <p className="text-sm text-text-secondary">
                    {player.position}
                  </p>
                  <p className="text-sm font-semibold text-secondary">
                    {player.baseCoins.toLocaleString()} coins
                  </p>
                </div>
              </div>
            ))}
            {team.players.length === 0 && (
              <p className="col-span-full text-center text-text-secondary py-8">
                This team has not acquired any players yet.
              </p>
            )}
            {filteredPlayers.length === 0 && team.players.length > 0 && (
              <p className="col-span-full text-center text-text-secondary py-8">
                No players match the current filters.
              </p>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Team Details"
      >
        <form onSubmit={handleUpdateTeam} className="space-y-4">
          <h3 className="font-semibold text-lg border-b border-gray-700 pb-2">
            Team Info
          </h3>
          <input
            name="name"
            value={editedTeamData.name || ""}
            onChange={handleEditInputChange}
            placeholder="Team Name"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />
          <input
            name="logoURL"
            value={editedTeamData.logoURL || ""}
            onChange={handleEditInputChange}
            placeholder="Logo URL"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
          />

          {loggedInAdmin && (
            <>
              <div>
                <label className="text-sm text-text-secondary">
                  Coins: {editedTeamData.coins?.toLocaleString()} coins
                </label>
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
                value={editedTeamData.email || ""}
                onChange={handleEditInputChange}
                placeholder="Login Email"
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
                required
              />
              <input
                name="password"
                type="text"
                value={editedTeamData.password || ""}
                onChange={handleEditInputChange}
                placeholder="New Password (optional)"
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
              />
            </>
          )}

          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-semibold text-lg mb-2">Manage Owners</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {(editedTeamData.owners || []).map((owner, index) => (
                <div
                  key={owner.id || index}
                  className="flex items-center space-x-2"
                >
                  <input
                    value={owner.name}
                    onChange={(e) =>
                      handleOwnerChange(index, "name", e.target.value)
                    }
                    placeholder="Owner Name"
                    className="w-1/2 px-2 py-1 bg-background border border-gray-600 rounded"
                  />
                  <input
                    value={owner.role}
                    onChange={(e) =>
                      handleOwnerChange(index, "role", e.target.value)
                    }
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
            <button
              type="button"
              onClick={addOwner}
              className="mt-2 text-sm text-primary hover:underline"
            >
              + Add Owner
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
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

export default TeamDetailsPage;
