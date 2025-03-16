"use client";

import { useAuth } from "@/services/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

const Redirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { session } = useAuth();

  if (!!session) {
    router.push("/");
  }

  return <>{children}</>;
};

export default Redirect;
