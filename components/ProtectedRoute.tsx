"use client";

import { useAuth } from "@/services/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      toast.error("Please log in to access this page");
      router.push("/login");
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-20">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
}
