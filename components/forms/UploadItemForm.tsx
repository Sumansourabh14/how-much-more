"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

const UploadItemForm = () => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadToSupabase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = null;

      // Upload image to Supabase Storage if an image is selected
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        // Don't include the bucket name in the file path
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from("items")
          .upload(filePath, image);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from("items")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Create payload with image URL if available
      const payload = {
        item_name: itemName,
        item_price: itemPrice,
        user_price: price,
        currency: currency,
        image_url: imageUrl,
      };

      const { error, status } = await supabase.from("items").insert(payload);

      if (error) {
        toast(`Error: ${error.message}`);
      }

      if (status === 201) {
        toast(`Data submitted`);
        // Reset form after successful submission
        setItemName("");
        setItemPrice("");
        setPrice("");
        setCurrency("USD");
        setImage(null);
        setImagePreview(null);
      }
    } catch (error: unknown) {
      console.error("Error uploading:", error);

      let errorMessage = "Failed to upload";
      if (isErrorWithMessage(error)) {
        errorMessage = error.message;
      }

      toast(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <form
      onSubmit={uploadToSupabase}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className="w-full"
            placeholder="Enter item name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="itemPrice" className="text-sm font-medium">
            Item price
          </Label>
          <Input
            type="number"
            id="itemPrice"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
            className="w-full"
            placeholder="Enter original price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">
            Your price
          </Label>
          <Input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full"
            placeholder="Enter your asking price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium">
            Currency
          </Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
              <SelectItem value="CAD">CAD (C$)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-medium">
            Item Image
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer w-full"
          />
        </div>

        {imagePreview && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image Preview</Label>
            <div className="relative h-48 w-full mt-2 border rounded-lg overflow-hidden">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            variant={"default"}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UploadItemForm;
