"use client";

import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { getCurrencySymbol } from "@/utils/functions";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/services/AuthContext";

interface Data {
  item_name: string;
  item_price: number;
  user_price: number;
  image_url: string;
  currency: string;
  user_id: string;
}

const ItemDetails = () => {
  const [data, setData] = useState<Data | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const { session } = useAuth();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!id) return;

      const { data, error, status } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();

      console.log({ data, error, status });

      if (error) {
        toast(`Error: ${error.message}`);
      }

      if (mounted) {
        setData(data);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("items").delete().eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("Goal deleted successfully");
      router.push("/items");
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error deleting goal: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (!data) {
    return <p>Loading...</p>;
  }

  const calculateDifference = (itemPrice: number, userPrice: number) => {
    if (itemPrice > userPrice) {
      return `${itemPrice - userPrice} left`;
    } else if (itemPrice < userPrice) {
      return false;
    }

    return itemPrice - userPrice;
  };

  const getEncouragementMessage = (percentage: number) => {
    if (percentage >= 0 && percentage < 20) {
      return "Just getting started! Keep going! 💪";
    } else if (percentage >= 20 && percentage < 40) {
      return "You're making progress! Keep it up! 🌱";
    } else if (percentage >= 40 && percentage < 60) {
      return "You're halfway there! You can do it! 🎯";
    } else if (percentage >= 60 && percentage < 80) {
      return "You're crushing it! Almost there! ⚡";
    } else if (percentage >= 80 && percentage < 100) {
      return "You're so close! Finish strong! 🏃‍♂️";
    } else if (percentage >= 100) {
      return "Congratulations! You did it! 🎉";
    }
    return "";
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <div className="max-w-[1200px] mx-auto">
          {data && (
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {data.image_url && (
                  <div className="relative w-full md:w-1/2 aspect-square">
                    <Image
                      src={data.image_url}
                      alt={data.item_name}
                      fill
                      className="object-cover rounded-lg"
                      priority
                    />
                  </div>
                )}
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold">{data.item_name}</h1>
                    {data.user_id === session?.user.id && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/item/${id}/edit`)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Dialog
                          open={isDeleteDialogOpen}
                          onOpenChange={setIsDeleteDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
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
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isDeleting}
                                className="cursor-pointer"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="cursor-pointer"
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base">Target Price</span>
                      <span className="text-xl font-bold">
                        {getCurrencySymbol(data.currency)}
                        {data.item_price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-base">Current</span>
                      <span className="text-xl font-bold text-green-600">
                        {getCurrencySymbol(data.currency)}
                        {data.user_price}
                      </span>
                    </div>

                    {calculateDifference(data.item_price, data.user_price) && (
                      <div className="p-4 rounded-lg border-2 border-blue-200">
                        <p className="text-base text-blue-700 font-medium">
                          {getCurrencySymbol(data.currency)}
                          {calculateDifference(
                            data.item_price,
                            data.user_price
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Progress
                      value={(data.user_price / data.item_price) * 100}
                      max={100}
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {((data.user_price / data.item_price) * 100).toFixed(2)}
                        %
                      </span>
                    </div>
                    <p className="text-base font-medium text-center mt-2">
                      {getEncouragementMessage(
                        (data.user_price / data.item_price) * 100
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
