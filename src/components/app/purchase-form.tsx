"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { saveRawMaterialPurchase } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type MaterialOption = { id: string; material_name: string; unit: string };
type CustomerOption = { id: string; customer_name: string; alias?: string | null };

type PurchaseItem = {
  key: string;
  raw_material_id: string;
  quantity: string;
  rate: string;
};

export function PurchaseForm({
  materials,
  customers,
}: {
  materials: MaterialOption[];
  customers: CustomerOption[];
}) {
  const [items, setItems] = useState<PurchaseItem[]>([
    { key: "item-0", raw_material_id: "", quantity: "", rate: "" },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { key: `item-${Date.now()}-${Math.random()}`, raw_material_id: "", quantity: "", rate: "" },
    ]);
  };

  const handleRemoveItem = (key: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.key !== key));
    }
  };

  const handleItemChange = (key: string, field: keyof PurchaseItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: value } : item))
    );
  };

  // Calculate total bill value
  const totalBillValue = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  return (
    <form action={saveRawMaterialPurchase} className="space-y-6">
      {/* 1st row: Purchase Date only */}
      <div className="grid gap-4 grid-cols-1">
        <div className="space-y-2 max-w-sm">
          <Label>Purchase Date</Label>
          <Input
            name="purchase_date"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>

      {/* 2nd row: Client, Bill number, Total Bill value */}
      <div className="grid gap-4 md:grid-cols-3 items-end">
        <div className="space-y-2">
          <Label>Client</Label>
          <select
            name="supplier_name"
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            defaultValue=""
          >
            <option value="" disabled>Select client</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.customer_name}>
                {customer.customer_name} {customer.alias ? `(${customer.alias})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Bill Number</Label>
          <Input name="bill_number" placeholder="Enter bill number" required />
        </div>

        <div className="rounded-md border bg-muted/40 p-3 h-10 flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-semibold">Total Bill Value:</span>
          <span className="font-bold text-base text-emerald-950">
            ₹{totalBillValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* 3rd row: Raw Material items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Purchase Items
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 font-semibold"
          >
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.key} className="flex flex-col md:flex-row gap-3 items-end bg-muted/10 p-3 rounded-lg border border-border">
              <div className="flex-1 w-full space-y-2">
                <Label className="md:hidden">Raw Material ID</Label>
                {index === 0 && <Label className="hidden md:block">Raw Material ID</Label>}
                <select
                  name="raw_material_id"
                  required
                  value={item.raw_material_id}
                  onChange={(e) => handleItemChange(item.key, "raw_material_id", e.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="" disabled>Select material</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.material_name} ({material.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-40 space-y-2">
                <Label className="md:hidden">Qty</Label>
                {index === 0 && <Label className="hidden md:block">Qty</Label>}
                <Input
                  name="quantity"
                  type="number"
                  step="0.01"
                  required
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.key, "quantity", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="w-full md:w-40 space-y-2">
                <Label className="md:hidden">Unit Rate (₹)</Label>
                {index === 0 && <Label className="hidden md:block">Unit Rate (₹)</Label>}
                <Input
                  name="rate"
                  type="number"
                  step="0.01"
                  required
                  value={item.rate}
                  onChange={(e) => handleItemChange(item.key, "rate", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 w-10 shrink-0"
                  onClick={() => handleRemoveItem(item.key)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Large Total Bill Value Display after 3rd row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg bg-emerald-50/20 p-4 border-emerald-100">
        <div>
          <span className="text-muted-foreground font-semibold text-sm">TOTAL BILL VALUE:</span>
          <p className="text-xs text-muted-foreground mt-0.5">Sum of all added raw material items</p>
        </div>
        <div className="font-extrabold text-2xl text-emerald-950 mt-2 md:mt-0">
          ₹{totalBillValue.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

      {/* Remarks */}
      <div className="space-y-2">
        <Label>Remarks</Label>
        <Textarea name="remarks" placeholder="Optional remarks or notes about the purchase..." />
      </div>

      <div>
        <ConfirmSubmitButton
          confirmTitle="Save raw material purchase?"
          confirmDescription={`Confirm client, bill number, and items count (${items.length}) before saving.`}
        >
          Save Purchase
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
