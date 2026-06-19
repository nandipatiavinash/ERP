"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createSalesOrder } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Customer = { id: string; name: string; alias?: string | null };
type ProductOption = { id: string; label: string };

type DeliveryEntryFormProps = {
  customers: Customer[];
  fabricProducts: ProductOption[];
  rotoProducts: ProductOption[];
  offsetProducts: ProductOption[];
};

type ItemRow = {
  department: string;
  productId: string;
  quantity: string;
};

export function DeliveryEntryForm({
  customers,
  fabricProducts,
  rotoProducts,
  offsetProducts,
}: DeliveryEntryFormProps) {
  const [rows, setRows] = useState<ItemRow[]>([
    { department: "fabric", productId: "", quantity: "" },
  ]);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addRow = () => {
    setRows([...rows, { department: "fabric", productId: "", quantity: "" }]);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof ItemRow, value: string) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    // Clear product ID if department changes
    if (field === "department") {
      updated[index].productId = "";
    }
    setRows(updated);
  };

  const getProductOptions = (dept: string): ProductOption[] => {
    switch (dept) {
      case "fabric":
        return fabricProducts;
      case "roto-printing":
        return rotoProducts;
      case "offset-printing":
        return offsetProducts;
      case "lamination":
        return [
          { id: "lam-film-25", label: "Laminated Film 2.5 mil" },
          { id: "lam-film-30", label: "Laminated Film 3.0 mil" },
        ];
      case "finishing":
        return [
          { id: "finished-bags-28", label: "Finished Bags W-28" },
          { id: "finished-bags-32", label: "Finished Bags W-32" },
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsPending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await createSalesOrder(formData);
      form.reset();
      setRows([{ department: "fabric", productId: "", quantity: "" }]);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create sales order.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customer_id">Firm Name</Label>
          <select
            id="customer_id"
            name="customer_id"
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>Select Firm</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.alias ? `(${c.alias})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_date">Order Date</Label>
          <Input
            id="order_date"
            name="order_date"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Order Items</h4>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => {
            const options = getProductOptions(row.department);

            return (
              <div
                key={index}
                className="grid gap-3 items-end p-4 border rounded-lg bg-muted/20 relative md:grid-cols-[1.5fr_2fr_1fr_auto]"
              >
                <div className="space-y-2">
                  <Label>Department</Label>
                  <select
                    name="department"
                    value={row.department}
                    onChange={(e) => updateRow(index, "department", e.target.value)}
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="fabric">Fabric</option>
                    <option value="roto-printing">Roto Printing</option>
                    <option value="lamination">Lamination</option>
                    <option value="offset-printing">Off-set Printing</option>
                    <option value="finishing">Finishing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Product ID / Type</Label>
                  <select
                    name="product_id"
                    value={row.productId}
                    onChange={(e) => updateRow(index, "productId", e.target.value)}
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="" disabled>Select product</option>
                    {options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity (Kgs)</Label>
                  <Input
                    name="quantity"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 5000"
                    value={row.quantity}
                    onChange={(e) => updateRow(index, "quantity", e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={addRow}
                    className="h-10 px-3 inline-flex items-center justify-center gap-1 rounded-md border border-input bg-background text-sm font-semibold text-primary hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    disabled={rows.length === 1}
                    className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:text-red-600 disabled:opacity-40 hover:bg-muted"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t flex justify-end">
        <ConfirmSubmitButton disabled={isPending} confirmTitle="Place Sales Order?" confirmDescription="This will create the sales order and prepare it for delivery assignment.">
          {isPending ? "Placing Order..." : "Place Order"}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
