"use client";
import React, { useEffect, useState } from "react";
import { Player } from "@/type/types";
import { useFirebase } from "@/contexts/FirebaseContext";
import { useRouter } from "next/navigation";

interface PlayerFormProps {
  onSubmit?: (
    player: Omit<Player, "id">,
    profileFile?: File,
    actionFile?: File
  ) => void;
  initialData?: Omit<Player, "id">;
  playerId?:string
}


const PlayerForm: React.FC<PlayerFormProps> = ({initialData, playerId}) => {

  // Detect edit mode
  const isEditMode = !!initialData;
  const { addPlayer, updateTeam } = useFirebase();
  const router = useRouter();
  const [player, setPlayer] = useState<Omit<Player, "id">>({
    name: "",
    nationality: "",
    position: "Batsman",
    dob: "",
    age: 0,
    gender: "",
    birthPlace: "",
    nickname: "",
    battingStyle: "",
    bowlingStyle: "",
    debutDate: undefined,
    baseCoins: 100000,
    profileImageURL: "",
    actionImageURL: "",
    stats: {
      matches: 0,
      innsN0: 0,
      inns: 0,
      runs: 0,
      ballsFaced: 0,
      highScore: 0,
      notOuts: 0,
      battingAverage: 0,
      strikeRate: 0,
      fours: 0,
      sixes: 0,
      fifties: 0,
      hundreds: 0,
      doubleHundreds: 0,
      wickets: 0,
      ballsBowled: 0,
      runsConceded: 0,
      bowlingAverage: 0,
      economyRate: 0,
      fiveWicketHauls: 0,
      tenWicketHauls: 0,
      bestBowlingInInnings: "",
      bestBowlingInMatch: "",
      catches: 0,
      stumpings: 0,
      byesConceded: 0,
      dismissals: 0,
      keepingEfficiency: 0,
    },
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [actionFile, setActionFile] = useState<File | null>(null);


    // ✅ Prefill data when editing
  useEffect(() => {
    if (initialData) {
      setPlayer({
        ...player,
        ...initialData,
        stats: { ...player.stats, ...initialData.stats },
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("stats.")) {
      const statKey = name.split(".")[1];
      setPlayer((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statKey]:
            type === "number" ? (value === "" ? "" : Number(value)) : value,
        },
      }));
    } else if (name === "debutDate") {
      setPlayer((prev) => ({
        ...prev,
        [name]: value || undefined,
      }));
    } else if (["age", "baseCoins"].includes(name)) {
      setPlayer((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setPlayer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (isEditMode && playerId) {
      // Update mode
      if (player.name?.trim()) {
        await updateTeam(playerId, player);
        alert("Player updated successfully!");
      }
    } else {
      // Create mode
      await addPlayer(player, profileFile || undefined, actionFile || undefined);
      alert("Player added successfully!");
    }

    router.push(`/dashboard/admin/players`);
  } catch (error) {
    console.error(error);
    alert("An error occurred while saving player data."); // notify user of error
  }
};

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0]);
    }
  };

  const handleActionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setActionFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6 bg-white rounded shadow space-y-6"
    >
      <h2 className="text-2xl font-semibold mb-4 col-span-4">Player Details</h2>

      <div className="grid grid-cols-4 gap-4">
        {/* Name */}
        <div className="col-span-2">
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={player.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Player Name"
          />
        </div>
        {/* Nationality */}
        <div className="col-span-2">
          <label htmlFor="nationality" className="block mb-1 font-medium">
            Nationality
          </label>
          <input
            id="nationality"
            name="nationality"
            value={player.nationality}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Country"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="gender" className="block mb-1 font-medium">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={player.gender ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Position */}
        <div className="col-span-2">
          <label htmlFor="position" className="block mb-1 font-medium">
            Position
          </label>
          <select
            id="position"
            name="position"
            value={player.position}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option>Batsman</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicketkeeper</option>
          </select>
        </div>
        {/* Position */}
        <div>
          <label htmlFor="position" className="block mb-1 font-medium">
            DOB
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={player.dob}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* Age */}
        <div>
          <label htmlFor="age" className="block mb-1 font-medium">
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={15}
            max={60}
            value={player.age}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* BaseCoins */}
        <div className="col-span-2">
          <label htmlFor="baseCoins" className="block mb-1 font-medium">
            Base Coins: {player.baseCoins.toLocaleString()}
          </label>
          <input
            id="baseCoins"
            name="baseCoins"
            type="range"
            min="10000"
            max="2000000"
            step="10000"
            value={player.baseCoins}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        {/* Birth Place */}
        <div className="col-span-2">
          <label htmlFor="birthPlace" className="block mb-1 font-medium">
            Birth Place
          </label>
          <input
            id="birthPlace"
            name="birthPlace"
            value={player.birthPlace}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="City, Country"
          />
        </div>
        {/* Nickname */}
        <div className="col-span-2">
          <label htmlFor="nickname" className="block mb-1 font-medium">
            Nickname (optional)
          </label>
          <input
            id="nickname"
            name="nickname"
            value={player.nickname}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Nickname"
          />
        </div>
        {/* Batting Style dropdown */}
        <div className="col-span-2">
          <label htmlFor="battingStyle" className="block mb-1 font-medium">
            Batting Style
          </label>
          <select
            id="battingStyle"
            name="battingStyle"
            value={player.battingStyle}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Batting Style</option>
            <option value="Right Handed Bat">Right Handed Bat</option>
            <option value="Left Handed Bat">Left Handed Bat</option>
          </select>
        </div>
        {/* Bowling Style dropdown */}
        <div className="col-span-2">
          <label htmlFor="bowlingStyle" className="block mb-1 font-medium">
            Bowling Style (optional)
          </label>
          <select
            id="bowlingStyle"
            name="bowlingStyle"
            value={player.bowlingStyle}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Bowling Style</option>
            <option value="Right-arm fast">Right-arm fast</option>
            <option value="Right-arm medium">Right-arm medium</option>
            <option value="Right-arm off spin">Right-arm off spin</option>
            <option value="Right-arm leg spin">Right-arm leg spin</option>
            <option value="Left-arm fast">Left-arm fast</option>
            <option value="Left-arm medium">Left-arm medium</option>
            <option value="Left-arm orthodox spin">
              Left-arm orthodox spin
            </option>
            <option value="Left-arm unorthodox spin">
              Left-arm unorthodox spin
            </option>
          </select>
        </div>
        {/* Debut Date */}
        <div>
          <label htmlFor="debutDate" className="block mb-1 font-medium">
            Debut Date
          </label>
          <input
            id="debutDate"
            name="debutDate"
            type="date"
            value={player.debutDate ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* Stats input fields */}
        {Object.entries(player.stats).map(([key, value]) => (
          <div key={key} className="col-span-1">
            <label className="block mb-1 font-medium capitalize">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type={typeof value === "number" ? "number" : "text"}
              name={`stats.${key}`}
              value={value === null || value === undefined ? "" : value}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              step={typeof value === "number" ? "any" : undefined}
              placeholder={key}
            />
          </div>
        ))}
      </div>

      {/* Profile and Action Images */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="text-sm text-text-secondary">Profile Image</label>
          <input
            type="file"
            onChange={handleProfileFileChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm text-text-secondary">Action Image</label>
          <input
            type="file"
            onChange={handleActionFileChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 bg-primary text-white rounded px-6 py-3 font-semibold hover:bg-primary-dark transition"
      >
        Save Player
      </button>
    </form>
  );
};

export default PlayerForm;
