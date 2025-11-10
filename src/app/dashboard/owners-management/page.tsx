"use client";
import React, { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';

export default function OwnersPage() {
  const { owners, addOwner, updateOwner, deleteOwner } = useFirebase();

  const [newOwner, setNewOwner] = useState({ name: '', email: '', phone: '' });

  const handleAddOwner = async () => {
    if (newOwner.name.trim() && newOwner.email.trim()) {
      await addOwner(newOwner);
      setNewOwner({ name: '', email: '', phone: '' });
    } else {
      alert('Name and Email are required');
    }
  };

  const handleDelete = async (ownerId: string) => {
    if (window.confirm('Delete this owner?')) {
      await deleteOwner(ownerId);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Owners Management</h1>

      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={newOwner.name}
          onChange={e => setNewOwner(prev => ({ ...prev, name: e.target.value }))}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={newOwner.email}
          onChange={e => setNewOwner(prev => ({ ...prev, email: e.target.value }))}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={newOwner.phone}
          onChange={e => setNewOwner(prev => ({ ...prev, phone: e.target.value }))}
          className="border rounded px-3 py-2 w-full"
        />
        <button onClick={handleAddOwner} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
          Add Owner
        </button>
      </div>

      <div className="space-y-4">
        {owners.map(owner => (
          <div key={owner.id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <p className="font-semibold">{owner.name}</p>
              <p className="text-sm">{owner.email}</p>
              <p className="text-sm">{owner.phone}</p>
            </div>
            <button onClick={() => handleDelete(owner.id)} className="text-red-600 hover:underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
