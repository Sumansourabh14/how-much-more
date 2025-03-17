"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      await supabase.auth.getSession();
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
      <div className="container mx-auto py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/items" className="block">
              <div className="relative bg-white rounded-lg border shadow-sm min-h-[400px] flex items-center justify-center overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070")',
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                <h2 className="relative text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300">
                  My Goals
                </h2>
              </div>
            </Link>

            <Link href="/item/upload" className="block">
              <div className="relative bg-white rounded-lg border shadow-sm min-h-[400px] flex items-center justify-center overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070")',
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                <h2 className="relative text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300">
                  Add New Goal
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
