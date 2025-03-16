"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();

      // Use nullish coalescing to handle undefined email
      setUserEmail(data.session?.user.email ?? null);
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-20">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
            <p className="mt-2 text-gray-600">
              {userEmail ? `Logged in as ${userEmail}` : "Welcome back!"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Your Goals</h2>
              <p className="text-gray-600 mb-4">
                Track and manage your savings goals
              </p>
              <Button asChild>
                <Link href="/items">View Your Goals</Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
              <p className="text-gray-600 mb-4">
                Create a new savings goal to track
              </p>
              <Button asChild>
                <Link href="/item/upload">Add New Goal</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
