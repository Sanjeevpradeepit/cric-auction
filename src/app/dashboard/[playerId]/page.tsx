"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useFirebase } from "@/contexts/FirebaseContext";
import PlayerForm from "../admin/add-player/page";

const EditPlayerPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ playerId: string }>();

  const { players, bids } = useFirebase();

  // Find player by ID
  const player = players.find((p) => p.id === params.playerId);

  // Optional: sort player bids
  // const playerBids = bids
  //   .filter((b) => b.playerId === params.playerId)
  //   .sort((a, b) => b.timestamp - a.timestamp);

  const handleOnBack = () => {
    router.push(`/dashboard/admin/players`);
  };

  if (!player) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-600">Player not found.</p>
        <button
          onClick={handleOnBack}
          className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Players
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Edit Player — {player.name}
        </h1>
        <button
          onClick={handleOnBack}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      {/* ✅ Pass player as initialData */}
      <PlayerForm initialData={player} playerId={params.playerId} />
    </div>
  );
};

export default EditPlayerPage;
