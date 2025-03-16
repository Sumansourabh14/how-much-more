"use client";

import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Data {
  item_name: string;
  item_price: number;
  user_price: number;
}

const ItemDetails = () => {
  const [data, setData] = useState<Data | null>(null);

  const { id } = useParams();

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

  return (
    <div className=" min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1>How much more?</h1>
        <div className="max-w-[800px] mx-auto">
          {data && (
            <div>
              <h3>{data.item_name}</h3>

              <p>{calculateDifference(data.item_price, data.user_price)}</p>
              <div>
                <Progress value={data.user_price} max={data.item_price} />
                <div className="flex justify-between">
                  <p>{data.item_price}</p>
                  <p>{data.user_price}</p>
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
