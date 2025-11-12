"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
// <- make sure you have this component
import { useFirebase } from "@/contexts/FirebaseContext";
import Loading from "@/components/Loading";

export default function RootPage() {
  const router = useRouter();
  const { loggedInTeamId, loggedInAdmin, loading } = useFirebase();

  // Handle redirects when user is authenticated
  useEffect(() => {
    if (loading) return; // wait until Firebase auth resolves

    if (loggedInTeamId) {
      router.push(`/team-dashboard/${loggedInTeamId}`); // navigate to team page
    } else if (loggedInAdmin) {
      router.push("/dashboard/admin/"); // navigate to admin page
    }
  }, [loading, loggedInTeamId, loggedInAdmin, router]);

  // Show loading screen
  if (loading) {
    return <Loading />; // you can customize this spinner / loader
  }

  // If not logged in, show homepage
  return (
    <>
      <Header />
      <main>
        <HomePage />
      </main>
    </>
  );
}
