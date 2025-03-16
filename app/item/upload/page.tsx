"use client";

import UploadItemForm from "@/components/forms/UploadItemForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const UploadItem = () => {
  return (
    <ProtectedRoute>
      <div>
        <div className="max-w-[500px] mx-auto">
          <UploadItemForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UploadItem;
