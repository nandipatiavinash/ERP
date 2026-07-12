"use client";

import { useRef, useState, useMemo } from "react";
import { Plus, Trash2, PackagePlus } from "lucide-react";
import { saveProductPurchase } from "@/app/(app)/_actions/product-purchase";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/lib/utils";

type SupplierOption = { id: string; customer_name: string; alias?: string | null };
type CatalogOption = { id: string; fabric_name?: string; brand?: string; width?: number; height?: number };

type PurchaseItemRow = {
  key: string;
  department: string;
  rotoProductId: string;
  offsetProductId: string;
  productLabel: string;
  fabricTypeId: string;
  fabricLabel: string;
  laminationType: string;
  offsetType: string;
  quantity: number;
  weight: number;
  rate: number;
  amount: number;
};

export function ProductPurchaseForm({
  suppliers,
  fabricTypes,
  rotoProducts,
  offsetProducts,
  selectedDate,
}: {
  suppliers: SupplierOption[];
  fabricTypes: CatalogOption[];
  rotoProducts: CatalogOption[];
  offsetProducts: CatalogOption[];
  selectedDate: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [items, setItems] = useState<PurchaseItemRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  // Form states for currently selected row input
  const [department, setDepartment] = useState("");
  const [brandProductId, setBrandProductId] = useState("");
  const [fabricTypeId, setFabricTypeId] = useState("");
  const [laminationType, setLaminationType] = useState("PLAIN");
  const [offsetType, setOffsetType] = useState("PLAIN");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [rate, setRate] = useState("");

  const sortedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => a.customer_name.localeCompare(b.customer_name));
  }, [suppliers]);

  const activeBrandsCatalog = useMemo(() => {
    if (department === "roto-printing") return rotoProducts;
    if (department === "offset-printing") return offsetProducts;
    return [];
  }, [department, rotoProducts, offsetProducts]);

  const handleDeptChange = (val: string) => {
    setDepartment(val);
    setBrandProductId("");
    setFabricTypeId("");
    setQuantity("");
    setWeight("");
    setRate("");
  };

  const handleAddItem = () => {
    if (!department) return;
    const qtyVal = Number(quantity);
    const weightVal = Number(weight);
    const rateVal = Number(rate);

    if (isNaN(qtyVal) || qtyVal <= 0) return;
    if (isNaN(weightVal) || weightVal <= 0) return;
    if (isNaN(rateVal) || rateVal <= 0) return;

    const isBrandRequired = ["roto-printing", "offset-printing"].includes(department);
    if (isBrandRequired && !brandProductId) return;

    const isFabricRequired = ["fabric", "lamination", "offset-printing", "finishing"].includes(department);
    if (isFabricRequired && !fabricTypeId) return;

    // Get item names
    let productLabel = "";
    if (isBrandRequired) {
      const match = activeBrandsCatalog.find((x) => x.id === brandProductId);
      productLabel = match ? (match.brand || "Brand") : "Brand";
    } else {
      productLabel = department === "fabric" ? "Gray Fabric" : department === "finishing" ? "Finished Bag" : "Lamination Film";
    }

    let fabricLabel = "";
    if (fabricTypeId) {
      const match = fabricTypes.find((x) => x.id === fabricTypeId);
      fabricLabel = match ? (match.fabric_name || "Fabric") : "";
    }

    const calculatedAmount = qtyVal * rateVal;

    const newRow: PurchaseItemRow = {
      key: `item-${Date.now()}-${Math.random()}`,
      department,
      rotoProductId: department === "roto-printing" ? brandProductId : "",
      offsetProductId: department === "offset-printing" ? brandProductId : "",
      productLabel,
      fabricTypeId: isFabricRequired ? fabricTypeId : "",
      fabricLabel,
      laminationType: department === "lamination" ? laminationType : "",
      offsetType: department === "offset-printing" ? offsetType : "",
      quantity: qtyVal,
      weight: weightVal,
      rate: rateVal,
      amount: calculatedAmount,
    };

    setItems((prev) => [...prev, newRow]);

    // Reset row controls
    setBrandProductId("");
    setFabricTypeId("");
    setQuantity("");
    setWeight("");
    setRate("");
  };

  const handleRemoveItem = (key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  // Grand Total of all purchase items
  const totalBillValue = items.reduce((sum, item) => sum + item.amount, 0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving || items.length === 0) return;

    setIsSaving(true);
    setErrorText(null);
    setSuccessText(null);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("total_bill_value", String(totalBillValue));

      items.forEach((item) => {
        formData.append("department", item.department);
        formData.append("roto_product_id", item.rotoProductId);
        formData.append("offset_product_id", item.offsetProductId);
        formData.append("fabric_type_id", item.fabricTypeId);
        formData.append("lamination_type", item.laminationType);
        formData.append("offset_type", item.offsetType);
        formData.append("quantity", String(item.quantity));
        formData.append("weight", String(item.weight));
        formData.append("rate", String(item.rate));
      });

      await saveProductPurchase(formData);
      setSuccessText("Product Purchase recorded successfully!");
      setItems([]);
      formRef.current?.reset();
    } catch (err: any) {
      setErrorText(err.message || "Failed to save purchase.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <PackagePlus className="w-5 h-5 text-emerald-600" />
        <h3 className="text-sm font-semibold text-slate-800">Add Product Purchase</h3>
      </div>

      {errorText && <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-md">{errorText}</div>}
      {successText && <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md">{successText}</div>}

      {/* Basic header details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="supplier_name" className="text-xs font-semibold text-slate-700">Supplier Name (Client)</Label>
          <select
            id="supplier_name"
            name="supplier_name"
            required
            className="w-full h-9 text-xs border border-slate-200 rounded-md bg-background px-3 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
          >
            <option value="">Select Supplier...</option>
            {sortedSuppliers.map((sup) => (
              <option key={sup.id} value={sup.customer_name}>
                {sup.customer_name} {sup.alias ? `(${sup.alias})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purchase_date" className="text-xs font-semibold text-slate-700">Purchase Date</Label>
          <Input id="purchase_date" name="purchase_date" type="date" defaultValue={selectedDate} required className="h-9 text-xs font-semibold" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bill_number" className="text-xs font-semibold text-slate-700">Bill Number</Label>
          <Input id="bill_number" name="bill_number" type="text" placeholder="BP-1234" required className="h-9 text-xs font-semibold" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="remarks" className="text-xs font-semibold text-slate-700">Remarks (Optional)</Label>
        <Textarea id="remarks" name="remarks" placeholder="Enter purchase details..." rows={2} className="text-xs font-semibold shadow-none border-slate-200" />
      </div>

      {/* Item Creator Block */}
      <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-100 space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Add Product Item</span>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-600">Department</Label>
            <select
              value={department}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="w-full h-8 text-[11px] border border-slate-200 rounded bg-white px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            >
              <option value="">Select Dept...</option>
              <option value="fabric">Fabric</option>
              <option value="roto-printing">Roto Printing</option>
              <option value="lamination">Lamination</option>
              <option value="offset-printing">Offset Printing</option>
              <option value="finishing">Finishing / Bags</option>
            </select>
          </div>

          {/* Brand/Design selector for Printing departments */}
          {["roto-printing", "offset-printing"].includes(department) && (
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-600">Brand / Design</Label>
              <select
                value={brandProductId}
                onChange={(e) => setBrandProductId(e.target.value)}
                className="w-full h-8 text-[11px] border border-slate-200 rounded bg-white px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
              >
                <option value="">Select Brand...</option>
                {activeBrandsCatalog.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.brand} {prod.width ? `(${prod.width}x${prod.height})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Fabric Type selector for Fabric, Lamination, Offset, Finishing */}
          {["fabric", "lamination", "offset-printing", "finishing"].includes(department) && (
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-600">Fabric Type (Specification)</Label>
              <select
                value={fabricTypeId}
                onChange={(e) => setFabricTypeId(e.target.value)}
                className="w-full h-8 text-[11px] border border-slate-200 rounded bg-white px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
              >
                <option value="">Select Fabric...</option>
                {fabricTypes.map((fab) => (
                  <option key={fab.id} value={fab.id}>
                    {fab.fabric_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {department === "lamination" && (
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-600">Lamination Type</Label>
              <select
                value={laminationType}
                onChange={(e) => setLaminationType(e.target.value)}
                className="w-full h-8 text-[11px] border border-slate-200 rounded bg-white px-2 py-0.5 focus:outline-none"
              >
                <option value="PLAIN">PLAIN</option>
                <option value="NW">NW</option>
                <option value="LAMINATED">LAMINATED</option>
                <option value="BOX">BOX</option>
                <option value="F_S">F_S</option>
                <option value="H_S">H_S</option>
              </select>
            </div>
          )}

          {department === "offset-printing" && (
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-600">Offset Type</Label>
              <select
                value={offsetType}
                onChange={(e) => setOffsetType(e.target.value)}
                className="w-full h-8 text-[11px] border border-slate-200 rounded bg-white px-2 py-0.5 focus:outline-none"
              >
                <option value="PLAIN">PLAIN</option>
                <option value="NW_LAM">NW_LAM</option>
                <option value="PLAIN_LAM">PLAIN_LAM</option>
                <option value="NW">NW</option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-600">
              {department === "finishing" ? "Quantity (Bags)" : "Quantity (Meters)"}
            </Label>
            <Input type="number" min="0" placeholder="1000" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-8 text-xs font-semibold" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-600">Weight (KG)</Label>
            <Input type="number" min="0" step="0.1" placeholder="50.0" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-8 text-xs font-semibold" />
          </div>

          <div className="space-y-1.5 col-span-2">
            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-600">Rate (₹)</Label>
                <Input type="number" min="0" step="0.01" placeholder="10.00" value={rate} onChange={(e) => setRate(e.target.value)} className="h-8 text-xs font-semibold" />
              </div>
              <Button type="button" onClick={handleAddItem} className="h-8 text-[10px] bg-slate-800 hover:bg-slate-700 w-full text-white">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmed items list */}
      {items.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Purchase Items List</span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-100 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="capitalize px-1.5 py-0.5 bg-emerald-100 rounded text-[9px] font-bold text-emerald-800">
                      {item.department.replace("-printing", "")}
                    </span>
                    <span className="font-semibold text-slate-700">{item.productLabel}</span>
                  </div>
                  {item.fabricLabel && <div className="text-[10px] text-slate-500 font-medium">Fabric: {item.fabricLabel}</div>}
                  <div className="text-[10px] text-slate-500">
                    {formatNumber(item.quantity, 0)} {item.department === "finishing" ? "bags" : "mtrs"} / {formatNumber(item.weight, 1)} kg @ ₹{formatNumber(item.rate, 2)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">₹{formatNumber(item.amount, 2)}</span>
                  <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveItem(item.key)} className="h-6 w-6 text-rose-500 hover:text-rose-700 hover:bg-rose-50 shadow-none">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded border border-emerald-100 font-bold text-sm">
            <span className="text-emerald-950">Grand Total:</span>
            <span className="text-emerald-950 font-black text-base">₹{formatNumber(totalBillValue, 2)}</span>
          </div>
        </div>
      )}

      {/* Submit */}
      <ConfirmSubmitButton
        confirmTitle="Confirm Product Purchase?"
        confirmDescription={`Record this purchase entry of ₹${formatNumber(totalBillValue, 2)} and auto-generate stock entries and journal lines.`}
        disabled={items.length === 0}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9"
      />
    </form>
  );
}
