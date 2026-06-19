"use client";

import { useState } from "react";
import { saveRawMaterialPurchase } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MaterialOption = { id: string; material_name: string; unit: string };
type CustomerOption = { id: string; customer_name: string; alias?: string | null };

export function PurchaseForm({
  materials,
  customers,
}: {
  materials: MaterialOption[];
  customers: CustomerOption[];
}) {
  const [clientSelect, setClientSelect] = useState("");
  const [clientName, setClientName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [rate, setRate] = useState(0);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setClientSelect(val);
    if (val !== "custom") {
      setClientName(val);
    } else {
      setClientName("");
    }
  };

  return (
    <form action={saveRawMaterialPurchase} className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label>Raw Material ID</Label>
        <select
          name="raw_material_id"
          required
          className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          defaultValue=""
        >
          <option value="" disabled>Select material</option>
          {materials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.material_name} ({material.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Purchase Date</Label>
        <Input
          name="purchase_date"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div className="space-y-2">
        <Label>Client</Label>
        <select
          name="client_select"
          value={clientSelect}
          onChange={handleClientChange}
          required
          className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="" disabled>Select client / customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.customer_name}>
              {customer.customer_name} {customer.alias ? `(${customer.alias})` : ""}
            </option>
          ))}
          <option value="custom">-- Type Custom Name --</option>
        </select>
      </div>

      {clientSelect === "custom" && (
        <div className="space-y-2 md:col-span-3">
          <Label>Custom Client Name</Label>
          <Input
            name="supplier_name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter custom client name"
            required
          />
        </div>
      )}

      {clientSelect !== "custom" && (
        <input type="hidden" name="supplier_name" value={clientName} />
      )}

      <div className="space-y-2">
        <Label>Bill Number</Label>
        <Input name="bill_number" placeholder="Enter bill number" required />
      </div>

      <div className="space-y-2">
        <Label>Quantity</Label>
        <Input
          name="quantity"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Rate (₹/unit)</Label>
        <Input
          name="rate"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          onChange={(e) => setRate(Number(e.target.value))}
        />
      </div>

      <div className="rounded-md border bg-muted/40 p-3 text-sm md:col-span-3 flex items-center justify-between">
        <div>
          <span className="text-muted-foreground font-medium">Estimated Total Amount:</span>
        </div>
        <div className="font-bold text-base text-emerald-900">
          ₹{(quantity * rate).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

      <div className="space-y-2 md:col-span-3">
        <Label>Remarks</Label>
        <Textarea name="remarks" placeholder="Optional purchase remarks..." />
      </div>

      <div className="md:col-span-3">
        <ConfirmSubmitButton
          confirmTitle="Save raw material purchase?"
          confirmDescription="Confirm client, material, quantity, rate, and bill details before saving."
        >
          Save Purchase
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
