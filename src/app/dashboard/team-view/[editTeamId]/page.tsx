"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFirebase } from "@/contexts/FirebaseContext";
import { ArrowLeftIcon } from "@/components/IconComponents";
import { Team } from "@/type/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const EditTeamPage: React.FC = () => {
  const { updateTeam, owners, teams } = useFirebase();
  const router = useRouter();
  const params = useParams();
  const teamId = params.editTeamId as string;

  const [newTeam, setNewTeam] = useState<Omit<Team, "id"> & { password?: string }>({
    ownerId: "",
    name: "",
    logoURL: "",
    coins: 10000000,
    email: "",
    password: "",
    players: [],
    teamManage: [],
  });

  useEffect(() => {
    // Try to get team from context, if not, fetch from Firestore
    const loadedTeam = teams.find((t) => t.id === teamId);
    if (loadedTeam) {
      setNewTeam({ ...loadedTeam, password: "" }); // never prefill password
      return;
    }

    const fetchTeam = async () => {
      if (!teamId) return;
      const docRef = doc(db, "teams", teamId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const teamData = docSnap.data() as Omit<Team, "id">;
        setNewTeam({ ...teamData, password: "" });
      }
    };
    fetchTeam();
  }, [teamId, teams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setNewTeam((prev) => ({
      ...prev,
      [name]: type === "number" || name === "coins" ? parseInt(value) : value,
    }));
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newTeam.name.trim() && newTeam.email.trim()) {
      try {
        await updateTeam(teamId, {
          ...newTeam,
          password: undefined, // password handled elsewhere if needed
        });
        alert("Team updated successfully!");
        router.push("/dashboard/admin/teams");
      } catch (error) {
        console.error("Error updating team:", error);
        alert("Failed to update team. See console for details.");
      }
    } else {
      alert("Please fill in required fields.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-secondary hover:underline mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Team Management</span>
      </button>
      <div className="bg-surface p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Edit Team</h1>
        <p className="text-center text-text-secondary mb-8">
          Modify the details for the team.
        </p>
        <form onSubmit={handleUpdateTeam} className="space-y-4">
          <div className="col-span-2">
            <label htmlFor="ownerId" className="block mb-1 font-medium">
              Owner
            </label>
            <select
              id="ownerId"
              name="ownerId"
              value={newTeam.ownerId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
              required
            >
              <option value="">Select Owner</option>
              {owners
                ?.filter((o) => !o.selected || o.id === newTeam.ownerId)
                .map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
            </select>
          </div>

          <input
            name="name"
            value={newTeam.name}
            onChange={handleInputChange}
            placeholder="Team Name"
            aria-label="Enter team name"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />

          {/* Logo upload can be added if needed */}

          <div>
            <label className="text-sm text-text-secondary">
              Coins: {newTeam.coins.toLocaleString()} coins
            </label>
            <input
              name="coins"
              type="number"
              value={newTeam.coins}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            />
          </div>

          <input
            name="email"
            type="email"
            value={newTeam.email}
            onChange={handleInputChange}
            placeholder="Login Email"
            aria-label="Enter team login email"
            className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
            required
          />

          {/* Password is not editable here, or handle with separate mechanism */}
          <input
  name="password"
  type="password"
  value={newTeam.password}
  onChange={handleInputChange}
  placeholder="Login Password"
  aria-label="Enter team login password"
  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
  required
/>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105"
          >
            Update Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTeamPage;
