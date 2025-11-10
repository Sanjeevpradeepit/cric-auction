"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/contexts/FirebaseContext";
import { ArrowLeftIcon } from "@/components/IconComponents";
import { Team } from "@/type/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AddTeamPage: React.FC = () => {
  const { addTeam, owners } = useFirebase();
  const router = useRouter();

  const [newTeam, setNewTeam] = useState<Omit<Team, "id"> & { password: string }>({
    ownerId: "",
    name: "",
    logoURL: "",
    coins: 10000000,
    email: "",
    password: "",
    players: [],
    teamManage: [],
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewTeam((prev) => ({
      ...prev,
      [name]: type === "number" || name === "coins" ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newTeam.name.trim() && newTeam.email.trim() && newTeam.password.trim()) {
      try {
        const teamData = {
          ownerId: newTeam.ownerId,
          name: newTeam.name,
          logoURL: newTeam.logoURL,
          coins: newTeam.coins,
          email: newTeam.email,
          password: newTeam.password,
        };

        // Optional: update owner document if you want to mark ownership or similar
        if (newTeam.ownerId) {
          const ownerDoc = doc(db, "owners", newTeam.ownerId);
          await updateDoc(ownerDoc, { selected: true });
        }

        await addTeam(teamData, logoFile || undefined);

        alert("Team created successfully!");
        router.push("/dashboard/admin/teams");
      } catch (error) {
        console.error("Error creating team:", error);
        alert("Failed to create team. See console for details.");
      }
    } else {
      alert("Please fill in all required fields.");
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
        <h1 className="text-3xl font-bold text-center mb-2">Create New Team</h1>
        <p className="text-center text-text-secondary mb-8">Enter the details for the new team.</p>
        <form onSubmit={handleAddTeam} className="space-y-4">
         <div className="col-span-2">
  <label htmlFor="ownerId" className="block mb-1 font-medium">Owner</label>
  <select
    id="ownerId"
    name="ownerId"
    value={newTeam.ownerId}
    onChange={handleInputChange}
    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
    required
  >
    <option value="">Select Owner</option>
    {owners?.filter(o => !o.selected).map(owner => (
      <option key={owner.id} value={owner.id}>{owner.name}</option>
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

<div>
  <label className="text-sm text-text-secondary">Logo Image</label>
  <input
    type="file"
    onChange={handleFileChange}
    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
  />
</div>

<div>
  <label className="text-sm text-text-secondary">Coins: {newTeam.coins.toLocaleString()} coins</label>
  <input
    name="coins"
    type="number"
    // min="5000000"
    // max="20000000"
    // step="500000"
     className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg"
    value={newTeam.coins}
    onChange={handleInputChange}
   
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
            Save Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeamPage;
