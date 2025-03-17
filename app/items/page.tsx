"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Item {
  id: number;
  item_name: string;
  item_price: number;
  user_price: number;
  image_url: string;
  currency: string;
}

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredItems = items.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="max-w-[1400px] mx-auto min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight">Items</h1>
            <p className="text-muted-foreground">
              Browse and manage your items
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {filteredItems.map((item) => (
            <Link href={`/item/${item.id}`} key={item.id}>
              <Card
                className={`hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
                  item.user_price >= item.item_price
                    ? "bg-green-50 border-green-200"
                    : ""
                }`}
              >
                <div className="relative w-[calc(100%+48px)] h-48 -mt-6 -mx-6">
                  <Image
                    src={item.image_url || "https://picsum.photos/600/400"}
                    alt={item.item_name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-xl font-semibold">
                    {item.item_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Destination:
                      </span>
                      <span className="font-medium">{item.item_price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Current:</span>
                      <span className="font-medium text-green-600">
                        {item.user_price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        {item.user_price >= item.item_price
                          ? "Achieved!"
                          : "Distance left:"}
                      </span>
                      <span
                        className={`font-medium ${
                          item.user_price >= item.item_price
                            ? "text-green-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.user_price >= item.item_price
                          ? "✓"
                          : item.item_price - item.user_price}
                      </span>
                    </div>
                  </div>
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
