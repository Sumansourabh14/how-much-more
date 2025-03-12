"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const UploadItemForm = () => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [price, setPrice] = useState("");

  const uploadToSupabase = async (e) => {
    e.preventDefault();

    const payload = {
      item_name: itemName,
      item_price: itemPrice,
      user_price: price,
    };

    const { data, error, status } = await supabase
      .from("items")
      .insert(payload);

    console.log({ data, error, status });

    if (error) {
      toast(`Error: ${error.message}`);
    }

    if (status === 201) {
      toast(`Data submitted`);
    }

    return;
  };

  return (
    <form onSubmit={uploadToSupabase}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="itemPrice">Item price</Label>
        <Input
          type="number"
          id="itemPrice"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="price">User price</Label>
        <Input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <Button type="submit" variant={"default"}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default UploadItemForm;
