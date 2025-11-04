
import React from 'react';

const InputField: React.FC<{ label: string, type: string, id: string, placeholder: string, required?: boolean }> = ({ label, type, id, placeholder, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        <input 
            type={type} 
            id={id} 
            name={id}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition" 
        />
    </div>
);

const CreateAuctionPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    alert('Auction created successfully! (Simulation)');
  };

  return (
    <div className="max-w-4xl mx-auto bg-surface p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-2 text-text-primary">Create New Auction</h1>
      <p className="text-center text-text-secondary mb-8">Fill in the details below to set up your cricket auction.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Auction Title" type="text" id="title" placeholder="e.g., Premier League 2024" required />
            <InputField label="Organizer Name" type="text" id="organizer" placeholder="Your Name or Organization" required />
        </div>
        
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">Auction Description</label>
            <textarea 
                id="description" 
                name="description" 
                rows={4}
                placeholder="Briefly describe the auction."
                className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition"
            ></textarea>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Start Time" type="datetime-local" id="startTime" placeholder="" required />
            <InputField label="End Time" type="datetime-local" id="endTime" placeholder="" required />
        </div>
        
        <div className="border-t border-gray-700 pt-6">
             <h2 className="text-xl font-semibold mb-4 text-text-primary">Auction Rules</h2>
             <div className="grid md:grid-cols-2 gap-6">
                <InputField label="Team Coins" type="number" id="coins" placeholder="e.g., 1000000" required />
                <InputField label="Max Players per Team" type="number" id="maxPlayers" placeholder="e.g., 18" required />
                <InputField label="Minimum Bid Increment (coins)" type="number"id="minIncrement" placeholder="e.g., 10000" required />
                <InputField label="Bid Timer (seconds)" type="number" id="bidTimer" placeholder="e.g., 60" required />
             </div>
        </div>

        <div className="flex justify-end pt-4">
            <button 
                type="submit" 
                className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 hover:scale-105"
            >
                Launch Auction
            </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuctionPage;