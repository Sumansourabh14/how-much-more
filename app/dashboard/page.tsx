"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Item {
  id: number;
  item_name: string;
  item_price: number;
  user_price: number;
  image_url: string;
  currency: string;
}

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("items").select("*");

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data);
      }
      setIsLoading(false);
    };

    fetchItems();
  }, []);

  const totalItems = items.length;
  const achievedItems = items.filter(
    (item) => item.user_price >= item.item_price
  ).length;
  const totalGoal = items.reduce((sum, item) => sum + item.item_price, 0);
  const totalCurrent = items.reduce((sum, item) => sum + item.user_price, 0);
  const totalRemaining = totalGoal - totalCurrent;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-20">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your overall savings progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold">{totalItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Achieved
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold text-green-600">
                  {achievedItems}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold">
                  ₹{totalGoal.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold text-orange-600">
                  ₹{totalRemaining.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/items" className="block">
              <div className="relative bg-white rounded-lg border shadow-sm min-h-[400px] flex items-center justify-center overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070")',
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                <h2 className="relative text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300">
                  My Goals
                </h2>
              </div>
            </Link>

            <Link href="/item/upload" className="block">
              <div className="relative bg-white rounded-lg border shadow-sm min-h-[400px] flex items-center justify-center overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070")',
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                <h2 className="relative text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300">
                  Add New Goal
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
