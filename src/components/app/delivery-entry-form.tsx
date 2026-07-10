"use client";

import { useState } from "react";
import { showSuccess } from "@/lib/toast";
import { Plus, Trash2, PackagePlus } from "lucide-react";
import { createSalesOrder } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isRedirectError } from "@/lib/utils";

type Customer = { id: string; name: string; alias?: string | null };
type ProductOption = { id: string; label: string };

type DeliveryEntryFormProps = {
  customers: Customer[];
  fabricProducts: ProductOption[];
  rotoProducts: ProductOption[];
  offsetProducts: ProductOption[];
  laminationProducts: ProductOption[];
  finishingProducts: ProductOption[];
};

type ConfirmedRow = {
  key: string;
  department: string;
  departmentLabel: string;
  productId: string;
  productLabel: string;
  quantity: string;
  // Dynamic fields
  fabricTypeId?: string | null;
  rotoProductId?: string | null;
  offsetProductId?: string | null;
  filmType?: string | null;
  isMetallic?: boolean;
  laminationType?: string | null;
  offsetType?: string | null;
};

const DEPT_LABELS: Record<string, string> = {
  fabric: "Fabric",
  "roto-printing": "Roto Printing",
  lamination: "Lamination",
  "offset-printing": "Offset Printing",
  finishing: "Finishing / Bags",
};

export function DeliveryEntryForm({
  customers,
  fabricProducts,
  rotoProducts,
  offsetProducts,
  laminationProducts,
  finishingProducts,
}: DeliveryEntryFormProps) {
  const [confirmedRows, setConfirmedRows] = useState<ConfirmedRow[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Staged Item Form State
  const [department, setDepartment] = useState<string>("fabric");
  const [fabricTypeId, setFabricTypeId] = useState<string>("");
  const [laminationProductId, setLaminationProductId] = useState<string>("");
  const [finishingProductId, setFinishingProductId] = useState<string>("");
  const [laminationType, setLaminationType] = useState<string>("");
  const [offsetType, setOffsetType] = useState<string>("none");
  const [offsetProductId, setOffsetProductId] = useState<string>("");
  const [filmType, setFilmType] = useState<string>("none");
  const [rotoProductId, setRotoProductId] = useState<string>("");
  const [isMetallic, setIsMetallic] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>("");

  // Determine active fields
  const isFabricActive = ["fabric", "lamination", "offset-printing", "finishing"].includes(department);
  const isLamProdActive = department === "lamination";
  const isFinProdActive = department === "finishing";
  const isLamTypeActive = ["lamination", "finishing"].includes(department);
  const isOffsetTypeActive = ["offset-printing", "finishing"].includes(department);
  const isOffsetProductActive = department === "offset-printing" || (department === "finishing" && offsetType !== "none" && !!offsetType);
  const isFilmTypeActive = department === "roto-printing" || (["lamination", "finishing"].includes(department) && ["BOX", "F_S", "H_S"].includes(laminationType));
  const isRotoProductActive = department === "roto-printing" || (["lamination", "finishing"].includes(department) && ["BOX", "F_S", "H_S"].includes(laminationType));
  const isMetallicActive = department === "roto-printing" || (["lamination", "finishing"].includes(department) && ["BOX", "F_S", "H_S"].includes(laminationType));

  const qtyLabel = department === "finishing" ? "Qty (Bags)" : "Qty (Kgs)";

  const handleDeptChange = (val: string) => {
    setDepartment(val);
    setFabricTypeId("");
    setLaminationProductId("");
    setFinishingProductId("");
    setLaminationType("");
    setOffsetType("none");
    setOffsetProductId("");
    setFilmType("none");
    setRotoProductId("");
    setIsMetallic(false);
    setQuantity("");
  };

  const getRowDescription = (row: ConfirmedRow): string => {
    const fab = fabricProducts.find((x) => x.id === row.fabricTypeId)?.label;
    const roto = rotoProducts.find((x) => x.id === row.rotoProductId)?.label;
    const off = offsetProducts.find((x) => x.id === row.offsetProductId)?.label;

    if (row.department === "fabric") {
      return `Fabric ID: ${fab || "Unspecified"}`;
    }
    if (row.department === "roto-printing") {
      return `Film: ${row.filmType || "Unspecified"} · Brand: ${roto || "Unspecified"}${row.isMetallic ? " (Metallic)" : ""}`;
    }
    if (row.department === "lamination") {
      const lamProd = laminationProducts.find((x) => x.id === row.productId)?.label;
      const lamDetails = ["BOX", "F_S", "H_S"].includes(row.laminationType || "")
        ? ` (Film: ${row.filmType || "Unspecified"} · Brand: ${roto || "Unspecified"}${row.isMetallic ? " · Metallic" : ""})`
        : "";
      return `${lamProd || "Lamination"} · Fabric: ${fab || "Unspecified"} · Type: ${row.laminationType || "Unspecified"}${lamDetails}`;
    }
    if (row.department === "offset-printing") {
      return `Fabric: ${fab || "Unspecified"} · Type: ${row.offsetType || "Unspecified"} · Brand: ${off || "Unspecified"}`;
    }
    if (row.department === "finishing") {
      const finProd = finishingProducts.find((x) => x.id === row.productId)?.label;
      let extra = "";
      if (row.laminationType) {
        const lamDetails = ["BOX", "F_S", "H_S"].includes(row.laminationType)
          ? ` [Film: ${row.filmType || "Unspecified"} · Brand: ${roto || "Unspecified"}${row.isMetallic ? " · Metallic" : ""}]`
          : "";
        extra = ` · Lamination: ${row.laminationType}${lamDetails}`;
      } else if (row.offsetType && row.offsetType !== "none") {
        extra = ` · Offset: ${row.offsetType} [Brand: ${off || "Unspecified"}]`;
      }
      return `${finProd || "Finishing Bag"} · Fabric: ${fab || "Unspecified"}${extra}`;
    }
    return row.productLabel;
  };

  const handleAddItem = () => {
    // Basic validation
    if (department === "fabric" && !fabricTypeId) return;
    if (department === "roto-printing" && (!filmType || filmType === "none" || !rotoProductId)) return;
    if (department === "lamination" && (!laminationProductId || !fabricTypeId || !laminationType)) return;
    if (department === "lamination" && ["BOX", "F_S", "H_S"].includes(laminationType) && (!filmType || filmType === "none" || !rotoProductId)) return;
    if (department === "offset-printing" && (!fabricTypeId || !offsetType || !offsetProductId)) return;
    if (department === "finishing" && (!finishingProductId || !fabricTypeId)) return;
    if (department === "finishing" && laminationType && ["BOX", "F_S", "H_S"].includes(laminationType) && (!filmType || filmType === "none" || !rotoProductId)) return;
    if (department === "finishing" && offsetType !== "none" && !offsetProductId) return;
    if (!quantity || parseFloat(quantity) <= 0) return;

    let resProductId = "";
    let resProductLabel = "";

    if (department === "fabric") {
      resProductId = fabricTypeId;
      resProductLabel = fabricProducts.find((x) => x.id === fabricTypeId)?.label || "";
    } else if (department === "roto-printing") {
      resProductId = rotoProductId;
      resProductLabel = rotoProducts.find((x) => x.id === rotoProductId)?.label || "";
    } else if (department === "lamination") {
      resProductId = laminationProductId;
      resProductLabel = laminationProducts.find((x) => x.id === laminationProductId)?.label || "";
    } else if (department === "offset-printing") {
      resProductId = offsetProductId;
      resProductLabel = offsetProducts.find((x) => x.id === offsetProductId)?.label || "";
    } else if (department === "finishing") {
      resProductId = finishingProductId;
      resProductLabel = finishingProducts.find((x) => x.id === finishingProductId)?.label || "";
    }

    const newRow: ConfirmedRow = {
      key: `row-${Date.now()}-${Math.random()}`,
      department,
      departmentLabel: DEPT_LABELS[department] ?? department,
      productId: resProductId,
      productLabel: resProductLabel,
      quantity,
      fabricTypeId: isFabricActive ? fabricTypeId : null,
      rotoProductId: isRotoProductActive ? rotoProductId : null,
      offsetProductId: isOffsetProductActive ? offsetProductId : null,
      filmType: isFilmTypeActive ? filmType : null,
      isMetallic: isMetallicActive ? isMetallic : false,
      laminationType: isLamTypeActive ? laminationType : null,
      offsetType: isOffsetTypeActive ? offsetType : null,
    };

    setConfirmedRows((prev) => [...prev, newRow]);

    // Clear item inputs but preserve department
    setFabricTypeId("");
    setLaminationProductId("");
    setFinishingProductId("");
    setLaminationType("");
    setOffsetType("none");
    setOffsetProductId("");
    setFilmType("none");
    setRotoProductId("");
    setIsMetallic(false);
    setQuantity("");
  };

  const handleRemoveRow = (key: string) => {
    setConfirmedRows((prev) => prev.filter((r) => r.key !== key));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsPending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await createSalesOrder(formData);
      showSuccess("Submitted successfully!");
      form.reset();
      setConfirmedRows([]);
      setDepartment("fabric");
    } catch (err: any) {
      if (isRedirectError(err)) throw err;
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

      {/* Firm Name Selection (Only) */}
      <div className="max-w-md space-y-2">
        <Label htmlFor="customer_id" className="font-semibold text-slate-700">Firm Name</Label>
        <select
          id="customer_id"
          name="customer_id"
          required
          defaultValue=""
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

      {/* Dynamic Order Item Fields Staging Grid */}
      <div className="space-y-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Define Order Item
        </Label>

        <div className="flex flex-wrap gap-4">
          {/* Department Selection */}
          <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Department</Label>
            <select
              value={department}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {Object.entries(DEPT_LABELS).map(([val, lbl]) => (
                <option key={val} value={val}>{lbl}</option>
              ))}
            </select>
          </div>

          {/* Lamination Film Product Dropdown */}
          {isLamProdActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Lamination Product</Label>
              <select
                value={laminationProductId}
                onChange={(e) => setLaminationProductId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select film product</option>
                {laminationProducts.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Finishing Product Dropdown */}
          {isFinProdActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Finished Bag Product</Label>
              <select
                value={finishingProductId}
                onChange={(e) => setFinishingProductId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select bag product</option>
                {finishingProducts.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Fabric ID Dropdown */}
          {isFabricActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Fabric ID</Label>
              <select
                value={fabricTypeId}
                onChange={(e) => setFabricTypeId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select Fabric ID</option>
                {fabricProducts.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Lamination Type Dropdown */}
          {isLamTypeActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Lamination Type</Label>
              <select
                value={laminationType}
                onChange={(e) => setLaminationType(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">{department === "finishing" ? "None / Plain" : "Select type"}</option>
                <option value="PLAIN">PLAIN</option>
                <option value="NW">NW</option>
                <option value="BOX">BOX</option>
                <option value="F_S">F/S</option>
                <option value="H_S">H/S</option>
              </select>
            </div>
          )}

          {/* Offset Type Dropdown */}
          {isOffsetTypeActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Offset Type</Label>
              <select
                value={offsetType}
                onChange={(e) => setOffsetType(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="none">None</option>
                <option value="FABRIC">Fabric</option>
                <option value="NW">NW</option>
                <option value="NW_LAM">NW_LAM</option>
                <option value="PLAIN_LAM">PLAIN_LAM</option>
              </select>
            </div>
          )}

          {/* Offset ID / Brand */}
          {isOffsetProductActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Offset ID / Brand</Label>
              <select
                value={offsetProductId}
                onChange={(e) => setOffsetProductId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select offset brand</option>
                {offsetProducts.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Film Type Dropdown */}
          {isFilmTypeActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Film Type</Label>
              <select
                value={filmType}
                onChange={(e) => setFilmType(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="none">Select film type</option>
                <option value="gloss">Gloss</option>
                <option value="matt">Matt</option>
              </select>
            </div>
          )}

          {/* Roto Printing Brand */}
          {isRotoProductActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Roto Printing Brand</Label>
              <select
                value={rotoProductId}
                onChange={(e) => setRotoProductId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select brand</option>
                {rotoProducts.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Metallic Checkbox */}
          {isMetallicActive && (
            <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="is_metallic"
                checked={isMetallic}
                onChange={(e) => setIsMetallic(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <Label htmlFor="is_metallic" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                Metallic (Optional)
              </Label>
            </div>
          )}

          {/* Quantity Input */}
          <div className="w-full md:w-[calc(33.333%-11px)] min-w-[240px] space-y-1">
            <Label className="text-xs font-semibold text-slate-700">{qtyLabel}</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g. 5000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        {/* Add Item Button Row */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="default"
            onClick={handleAddItem}
            className="h-9 gap-1.5 px-4"
          >
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* Serialized Confirmed Items Input */}
      <input type="hidden" name="items_json" value={JSON.stringify(confirmedRows)} />

      {/* Order Items Table / List */}
      <div className="space-y-3">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 block">
          Order Items Staged
        </Label>

        {confirmedRows.length > 0 ? (
          <div className="space-y-2">
            {confirmedRows.map((row, idx) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white border border-slate-100 shadow-sm text-sm"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge className="text-[10px] uppercase font-bold text-slate-600 bg-slate-50">
                      {row.departmentLabel}
                    </Badge>
                    <span className="font-semibold text-slate-900">{idx + 1}. {row.productLabel}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {getRowDescription(row)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-slate-900 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-md">
                    {row.quantity} {row.department === "finishing" ? "pcs" : "kg"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(row.key)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-slate-50 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground text-sm border-2 border-dashed rounded-xl bg-slate-50/20">
            <PackagePlus className="h-8 w-8 opacity-40 text-slate-400" />
            <span>No items added yet. Define the item specifications above and click <strong>Add Item</strong>.</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t flex justify-end">
        <ConfirmSubmitButton
          disabled={isPending || confirmedRows.length === 0}
          confirmTitle="Place Sales Order?"
          confirmDescription="This will create the sales order draft with all specified items."
        >
          {isPending ? "Placing Order..." : "Place Order"}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
