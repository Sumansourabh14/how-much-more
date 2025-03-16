"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Item {
  id: number;
  item_name: string;
  item_price: number;
  user_price: number;
  image_url: string;
}

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("items").select("*");

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data);
      }
    };

    fetchItems();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-[1400px] mx-auto min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1>Items</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link href={`/item/${item.id}`} key={item.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{item.item_name}</CardTitle>
                  <CardDescription>
                    {item.image_url && (
                      <Image
                        src={item.image_url}
                        alt={item.item_name}
                        width={100}
                        height={100}
                      />
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{item.item_price}</p>
                  <p>{item.user_price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Items;
