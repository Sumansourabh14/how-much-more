"use client";

import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/services/AuthContext";
import { useRouter } from "next/navigation";

export default function GoogleSignUp() {
  const [isClicked, setIsClicked] = useState(false);
  const { session, loading } = useAuth();
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    if (!!session) {
      router.push("/items");
    }
  }, [session, router]);

  // Move the OAuth logic to useEffect to avoid triggering during render
  useEffect(() => {
    if (isClicked) {
      const initiateGoogleSignUp = async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/items`,
            },
          });

          if (error) {
            toast.error(error.message);
            setIsClicked(false);
          }
        } catch (error) {
          console.error("Error during Google sign up:", error);
          toast.error("An unexpected error occurred");
          setIsClicked(false);
        }
      };

      initiateGoogleSignUp();
    }
  }, [isClicked]);

  const handleGoogleSignUp = () => {
    setIsClicked(true);
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="container mx-auto max-w-md py-20">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-20">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign up with Google</h1>
          <p className="mt-2 text-gray-600">
            Click the button below to continue with Google
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            onClick={handleGoogleSignUp}
            disabled={isClicked}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="mr-2"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isClicked ? "Redirecting to Google..." : "Continue with Google"}
          </Button>

          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Log in
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                ← Back to all sign up options
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
