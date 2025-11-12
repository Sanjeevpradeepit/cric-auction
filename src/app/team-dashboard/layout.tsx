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
     
      <div className={`flex flex flex-col transition-all duration-300`}>
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

  );
};

export default DashboardLayout;
