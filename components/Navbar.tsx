"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/services/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Navbar() {
  const { session } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error("Error logging out");
        return;
      }

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-black">
            How Much More
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          {session && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/items"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            My Goals
          </Link>

          <Link
            href="/item/upload"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Add Goal
          </Link>

          {session ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
