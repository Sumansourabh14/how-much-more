"use client";

import UploadItemForm from "@/components/forms/UploadItemForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const UploadItem = () => {
  return (
    <ProtectedRoute>
      <div className="py-8">
        <div className="max-w-[500px] mx-auto">
          <h1 className="text-2xl font-semibold text-center mb-2">
            Share Your Item
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Upload your item details and let others know what you're looking to
            trade or sell.
          </p>
          <UploadItemForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UploadItem;
