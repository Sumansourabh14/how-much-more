"use client";

import UpdateItemForm from "@/components/forms/UpdateItemForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useParams } from "next/navigation";

export default function EditItem() {
  const { id } = useParams();

  return (
    <ProtectedRoute>
      <div className="max-w-[1400px] mx-auto min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight">Edit Goal</h1>
            <p className="text-muted-foreground">
              Update your financial goal details
            </p>
          </div>

          <UpdateItemForm itemId={id as string} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
