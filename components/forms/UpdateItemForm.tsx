"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

interface UpdateItemFormProps {
  itemId: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

const UpdateItemForm = ({ itemId }: UpdateItemFormProps) => {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("id", itemId)
          .single();

        if (error) {
          toast.error(error.message);
          return;
        }

        if (data) {
          setItemName(data.item_name);
          setItemPrice(data.item_price.toString());
          setPrice(data.user_price.toString());
          setCurrency(data.currency);
          setCurrentImageUrl(data.image_url);
          setImagePreview(data.image_url);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to fetch item details");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  const updateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = currentImageUrl;

      // Upload new image to Supabase Storage if an image is selected
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
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

        // Delete old image if it exists
        if (currentImageUrl) {
          const oldImagePath = currentImageUrl.split("/").pop();
          if (oldImagePath) {
            await supabase.storage.from("items").remove([oldImagePath]);
          }
        }
      }

      // Update item in the database
      const payload = {
        item_name: itemName,
        item_price: itemPrice,
        user_price: price,
        currency: currency,
        image_url: imageUrl,
      };

      const { error } = await supabase
        .from("items")
        .update(payload)
        .eq("id", itemId);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Item updated successfully");
      router.push(`/item/${itemId}`);
    } catch (error: unknown) {
      console.error("Error updating:", error);

      let errorMessage = "Failed to update";
      if (isErrorWithMessage(error)) {
        errorMessage = error.message;
      }

      toast.error(`Error: ${errorMessage}`);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={updateItem} className="bg-white p-6 rounded-lg">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Goal Name
          </Label>
          <Input
            type="text"
            id="name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className="w-full"
            placeholder="Enter goal name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="itemPrice" className="text-sm font-medium">
            Goal Price
          </Label>
          <Input
            type="number"
            id="itemPrice"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
            className="w-full"
            placeholder="Enter goal price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">
            Current Savings
          </Label>
          <Input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full"
            placeholder="Enter your current savings"
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
            Goal Image
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
            {uploading ? "Updating..." : "Update Goal"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateItemForm;
