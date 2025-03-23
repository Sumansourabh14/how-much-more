"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/services/AuthContext";
import { getCurrencySymbol } from "@/utils/functions";
import { Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface Item {
  id: number;
  item_name: string;
  item_price: number;
  user_price: number;
  image_url: string;
  currency: string;
  user_id: string;
}

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      fetchItems();
    }
  }, [session]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", session?.user.id);

    if (error) {
      console.error("Error fetching items:", error);
      return;
    }

    setItems(data || []);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("items").delete().eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("Goal deleted successfully");
      // Refresh the items list
      fetchItems();
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error deleting goal: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const filteredItems = items.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="max-w-[1400px] mx-auto min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight">Goals</h1>
            <p className="text-muted-foreground">
              Browse and manage your financial goals
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search financial goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {!!filteredItems.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="relative group">
                  <Link href={`/item/${item.id}`}>
                    <Card
                      className={`hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
                        item.user_price >= item.item_price
                          ? "bg-green-50 border-green-200"
                          : ""
                      }`}
                    >
                      <div className="relative w-[calc(100%+48px)] h-48 -mt-6 -mx-6">
                        <Image
                          src={
                            item.image_url || "https://picsum.photos/600/400"
                          }
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
                              Final price:
                            </span>
                            <span className="font-medium">
                              {getCurrencySymbol(item.currency)}
                              {item.item_price}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Current:
                            </span>
                            <span className="font-medium text-green-600">
                              {getCurrencySymbol(item.currency)}
                              {item.user_price}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">
                              {item.user_price >= item.item_price
                                ? "Achieved!"
                                : "Money left to achieve goal:"}
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
                                : `${getCurrencySymbol(item.currency)}${
                                    item.item_price - item.user_price
                                  }`}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  {item.user_id === session?.user.id && (
                    <Dialog
                      open={itemToDelete === item.id}
                      onOpenChange={(open) => !open && setItemToDelete(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            setItemToDelete(item.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Goal</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this goal? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setItemToDelete(null)}
                            disabled={isDeleting}
                            className="cursor-pointer"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="cursor-pointer"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">No goals found</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Items;
