"use client";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useFirebase } from '@/contexts/FirebaseContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { loggedInTeamId, loggedInAdmin, loading } = useFirebase();
  const isLoggedIn = !!loggedInTeamId || !!loggedInAdmin;

  if (loading) {
    return <div className="flex justify-center items-center h-full text-xl">Loading...</div>;
  }

  if (!isLoggedIn) {
    // Optionally, redirect to login or show a public fallback here
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-background font-sans flex">
      {isLoggedIn && (
        <Sidebar />
      )}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isLoggedIn ? 'md:ml-64' : 'ml-0'}`}>
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
