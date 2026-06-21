"use client";

import { useTransition } from "react";
import { deleteSalesOrderCompletely } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this order completely? This will clear all its items, reset roll allocations, and remove related double-entry journal items."
    );
    if (confirmation) {
      startTransition(async () => {
        try {
          await deleteSalesOrderCompletely(orderId);
        } catch (err: any) {
          window.alert(err.message || "Failed to delete order.");
        }
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
      disabled={isPending}
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
