"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProductPurchase } from "@/app/(app)/_actions/product-purchase";

export function DeleteProductPurchaseButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product purchase? This will also remove the corresponding rolls/bundles from stock registers and delete its journal entries."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("id", id);
      const result = await deleteProductPurchase(formData);
      if (!result.success) {
        alert(result.error || "Failed to delete product purchase.");
        setIsDeleting(false);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete product purchase.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete product purchase"
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
