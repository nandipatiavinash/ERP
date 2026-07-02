"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteRawMaterialPurchase } from "@/app/(app)/_actions";

export function DeletePurchaseButton({ purchaseId }: { purchaseId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this purchase entry? This action cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteRawMaterialPurchase(purchaseId);
    } catch (err: any) {
      alert(err?.message || "Failed to delete purchase entry.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete purchase"
      className="inline-flex items-center justify-center rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
