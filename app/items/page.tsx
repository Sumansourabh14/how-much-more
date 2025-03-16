"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  item_name: string;
  item_price: number;
  user_price: number;
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
    <div>
      <h1>Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link href={`/item/${item.id}`} key={item.id}>
            <Card>
              <CardHeader>
                <CardTitle>{item.item_name}</CardTitle>
                <CardDescription></CardDescription>
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
  );
};

export default Items;
