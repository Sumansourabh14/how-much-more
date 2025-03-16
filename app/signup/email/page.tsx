"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/AuthContext";

export default function EmailSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();
  const { session, loading } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (!!session) {
      router.push("/items");
    }
  }, [session, router]);

  // Handle redirect in useEffect to avoid Router updates during render
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/items");
    }
  }, [shouldRedirect, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign up the user without email confirmation
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Skip email confirmation
          emailRedirectTo: undefined,
          data: {
            email_confirmed: true,
          },
        },
      });

      if (signUpError) {
        toast.error(signUpError.message);
        setIsLoading(false);
        return;
      }

      // Immediately sign in the user after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.error(signInError.message);
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully");
      // Set redirect flag instead of directly calling router.push
      setShouldRedirect(true);
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-gray-600">
            Enter your email to create an account
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

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
  );
}
