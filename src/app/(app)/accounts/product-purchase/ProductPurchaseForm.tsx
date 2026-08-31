"use client";

import { useRef, useState, useMemo } from "react";
import { Plus, Trash2, PackagePlus, CheckCircle2 } from "lucide-react";
import { saveProductPurchase } from "@/app/(app)/_actions/product-purchase";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

type SupplierOption = { id: string; customer_name: string; alias?: string | null };
type CatalogOption = { id: string; fabric_name?: string; name?: string; brand?: string; width?: number; height?: number };
type ColorOption = { id: string; color_name: string };
type FabricRollOption = { id: string; roll_number: string; weight: number; meters: number; fabric_type_id: string };
type LaminationRollOption = { id: string; roll_id: string; s_no: number; weight_kg: number; meters: number; fabric_type_id: string };
type OffsetRollOption = { id: string; roll_id: string; s_no: number; weight_kg: number; fabric_type_id: string };

type PurchaseItemRow = {
  key: string;
  department: string;
  rotoProductId: string;
  offsetProductId: string;
  finishingProductId: string;
  productLabel: string;
  fabricTypeId: string;
  fabricLabel: string;
  laminationType: string;
  offsetType: string;
  quantity: number; // meters or bags
  weight: number;   // kg (net weight)
  rate: number;
  amount: number;
  sourceRollId: string;
  filmType: string;
  isMetallic: boolean;
  colorId: string;
  colorLabel: string;
  sourceRollLabel: string;
  supplierRollId: string;
  grossWeight?: number;
  coreWeight?: number;
  avgMtrWeight?: number; // g/m
};

export function ProductPurchaseForm({
  suppliers,
  fabricTypes,
  rotoProducts,
  offsetProducts,
  finishingProducts,
  colors,
  availableFabricRolls,
  availableLaminationRolls,
  availableOffsetRolls,
  selectedDate,
}: {
  suppliers: SupplierOption[];
  fabricTypes: CatalogOption[];
  rotoProducts: CatalogOption[];
  offsetProducts: CatalogOption[];
  finishingProducts: CatalogOption[];
  colors: ColorOption[];
  availableFabricRolls: FabricRollOption[];
  availableLaminationRolls: LaminationRollOption[];
  availableOffsetRolls: OffsetRollOption[];
  selectedDate: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [items, setItems] = useState<PurchaseItemRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [purchasedRollTags, setPurchasedRollTags] = useState<string[]>([]);

  // Form states for currently selected row input
  const [department, setDepartment] = useState("");
  const [brandProductId, setBrandProductId] = useState("");
  const [fabricTypeId, setFabricTypeId] = useState("");
  const [laminationType, setLaminationType] = useState("PLAIN");
  const [offsetType, setOffsetType] = useState("FABRIC");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [supplierRollId, setSupplierRollId] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [coreWeight, setCoreWeight] = useState("");

  // Total bill value
  const [manualBillValue, setManualBillValue] = useState("");

  // Spec states
  const [sourceRollId, setSourceRollId] = useState("");
  const [filmType, setFilmType] = useState("gloss");
  const [isMetallic, setIsMetallic] = useState(false);
  const [colorId, setColorId] = useState("");
  const [sourceType, setSourceType] = useState("fabric"); // Finishing source: 'fabric' | 'lamination' | 'offset'

  const sortedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => a.customer_name.localeCompare(b.customer_name));
  }, [suppliers]);

  const sortedFabricTypes = useMemo(() => {
    return [...fabricTypes].sort((a, b) => (a.fabric_name || "").localeCompare(b.fabric_name || ""));
  }, [fabricTypes]);

  const sortedColors = useMemo(() => {
    return [...colors].sort((a, b) => (a.color_name || "").localeCompare(b.color_name || ""));
  }, [colors]);

  const sortedRotoProducts = useMemo(() => {
    return [...rotoProducts].sort((a, b) => (a.brand || "").localeCompare(b.brand || ""));
  }, [rotoProducts]);

  const sortedOffsetProducts = useMemo(() => {
    return [...offsetProducts].sort((a, b) => (a.brand || "").localeCompare(b.brand || ""));
  }, [offsetProducts]);

  // Handle weight / gross weight / core weight changes and calculate net weight
  const handleGrossChange = (val: string) => {
    setGrossWeight(val);
    const g = parseFloat(val);
    const c = parseFloat(coreWeight);
    if (!isNaN(g) && !isNaN(c)) {
      const net = String(Math.max(0, Number((g - c).toFixed(2))));
      setWeight(net);
    } else if (!isNaN(g)) {
      setWeight(val);
    } else if (val === "") {
      setWeight("");
    }
  };

  const handleCoreChange = (val: string) => {
    setCoreWeight(val);
    const g = parseFloat(grossWeight);
    const c = parseFloat(val);
    if (!isNaN(g) && !isNaN(c)) {
      const net = String(Math.max(0, Number((g - c).toFixed(2))));
      setWeight(net);
    } else if (!isNaN(g) && (val === "" || isNaN(c))) {
      setWeight(String(g));
    }
  };

  // Compute live Avg Mtr Weight (g/m)
  const computedAvgMtrWeight = useMemo(() => {
    const w = parseFloat(weight);
    const q = parseFloat(quantity);
    if (!isNaN(w) && !isNaN(q) && q > 0) {
      return Number(((w / q) * 1000).toFixed(1)); // grams per meter
    }
    return null;
  }, [weight, quantity]);

  const handleDeptChange = (val: string) => {
    setDepartment(val);
    setBrandProductId("");
    setFabricTypeId("");
    setLaminationType("PLAIN");
    setOffsetType("FABRIC");
    setQuantity("");
    setWeight("");
    setSupplierRollId("");
    setSourceRollId("");
    setFilmType("gloss");
    setIsMetallic(false);
    setColorId("");
    setSourceType("fabric");
    setGrossWeight("");
    setCoreWeight("");
  };

  const handleAddItem = () => {
    if (!department) return;
    const qtyVal = Number(quantity);
    const weightVal = Number(weight);

    if (isNaN(qtyVal) || qtyVal <= 0) {
      setErrorText("Please enter a valid positive quantity.");
      return;
    }
    if (isNaN(weightVal) || weightVal <= 0) {
      setErrorText("Please enter a valid positive weight (net weight).");
      return;
    }

    setErrorText(null);

    // Validate department specific requirements
    if (department === "fabric" && !fabricTypeId) {
      setErrorText("Please select a Fabric Spec / Brand.");
      return;
    }

    if (department === "roto-printing" && !brandProductId) {
      setErrorText("Please select a Roto Printing Brand.");
      return;
    }

    if (department === "lamination") {
      if (!fabricTypeId) {
        setErrorText("Please select a Fabric Spec.");
        return;
      }
      if (["BOX", "F_S", "H_S"].includes(laminationType) && !brandProductId) {
        setErrorText("Please select a Roto Printing Brand for Box/F_S/H_S Lamination.");
        return;
      }
    }

    if (department === "offset-printing") {
      if (!fabricTypeId) {
        setErrorText("Please select a Fabric Spec.");
        return;
      }
      if (!brandProductId) {
        setErrorText("Please select an Offset Brand.");
        return;
      }
    }

    if (department === "finishing") {
      if (sourceType === "fabric" && !fabricTypeId) {
        setErrorText("Please select a Fabric Spec.");
        return;
      }
      if (sourceType === "lamination") {
        if (!fabricTypeId) {
          setErrorText("Please select a Fabric Spec.");
          return;
        }
        if (["BOX", "F_S", "H_S"].includes(laminationType) && !brandProductId) {
          setErrorText("Please select a Roto Printing Brand.");
          return;
        }
      }
      if (sourceType === "offset") {
        if (!fabricTypeId) {
          setErrorText("Please select a Fabric Spec.");
          return;
        }
        if (!brandProductId) {
          setErrorText("Please select an Offset Brand.");
          return;
        }
      }
    }

    // Determine labels
    let productLabel = "";
    if (department === "fabric") {
      productLabel = "Gray Fabric Roll";
    } else if (department === "roto-printing") {
      const match = rotoProducts.find((x) => x.id === brandProductId);
      productLabel = match?.brand || "Roto Roll";
    } else if (department === "lamination") {
      if (["BOX", "F_S", "H_S"].includes(laminationType)) {
        const match = rotoProducts.find((x) => x.id === brandProductId);
        productLabel = `${match?.brand || "Lamination Roll"} (${laminationType.replace("_", "/")})`;
      } else {
        productLabel = `Lamination Roll (${laminationType})`;
      }
    } else if (department === "offset-printing") {
      const match = offsetProducts.find((x) => x.id === brandProductId);
      productLabel = `${match?.brand || "Offset Roll"} (${offsetType})`;
    } else if (department === "finishing") {
      if (sourceType === "fabric") {
        productLabel = "Fabric Finished Bags";
      } else if (sourceType === "lamination") {
        if (["BOX", "F_S", "H_S"].includes(laminationType)) {
          const match = rotoProducts.find((x) => x.id === brandProductId);
          productLabel = `Lamination Bags - ${match?.brand || "Roto"} (${laminationType.replace("_", "/")})`;
        } else {
          productLabel = `Lamination Bags (${laminationType})`;
        }
      } else if (sourceType === "offset") {
        const match = offsetProducts.find((x) => x.id === brandProductId);
        productLabel = `Offset Bags - ${match?.brand || "Offset"} (${offsetType})`;
      }
    }

    let fabricLabel = "";
    if (fabricTypeId) {
      const match = fabricTypes.find((x) => x.id === fabricTypeId);
      fabricLabel = match ? (match.fabric_name || "") : "";
    }

    let colorLabel = "";
    if (colorId) {
      const c = colors.find((x) => x.id === colorId);
      colorLabel = c ? c.color_name : "";
    }

    const gWt = grossWeight ? Number(grossWeight) : undefined;
    const cWt = coreWeight ? Number(coreWeight) : undefined;
    const avgMtr = computedAvgMtrWeight !== null ? computedAvgMtrWeight : undefined;

    const newRow: PurchaseItemRow = {
      key: `item-${Date.now()}-${Math.random()}`,
      department,
      rotoProductId: department === "roto-printing" || (department === "lamination" && ["BOX", "F_S", "H_S"].includes(laminationType)) || (department === "finishing" && sourceType === "lamination" && ["BOX", "F_S", "H_S"].includes(laminationType)) ? brandProductId : "",
      offsetProductId: department === "offset-printing" || (department === "finishing" && sourceType === "offset") ? brandProductId : "",
      finishingProductId: "",
      productLabel,
      fabricTypeId,
      fabricLabel,
      laminationType: department === "lamination" ? laminationType : department === "finishing" && sourceType === "lamination" ? laminationType : "",
      offsetType: department === "offset-printing" ? offsetType : department === "finishing" && sourceType === "offset" ? offsetType : "",
      quantity: qtyVal,
      weight: weightVal,
      rate: 0,
      amount: 0,
      sourceRollId,
      filmType: department === "roto-printing" || (department === "lamination" && ["BOX", "F_S", "H_S"].includes(laminationType)) || (department === "finishing" && sourceType === "lamination" && ["BOX", "F_S", "H_S"].includes(laminationType)) ? filmType : "",
      isMetallic: department === "roto-printing" || (department === "lamination" && ["BOX", "F_S", "H_S"].includes(laminationType)) || (department === "finishing" && sourceType === "lamination" && ["BOX", "F_S", "H_S"].includes(laminationType)) ? isMetallic : false,
      colorId: department === "roto-printing" ? colorId : "",
      colorLabel,
      sourceRollLabel: "",
      supplierRollId: supplierRollId.trim(),
      grossWeight: gWt,
      coreWeight: cWt,
      avgMtrWeight: avgMtr,
    };

    setItems((prev) => [...prev, newRow]);

    // Reset row form state
    setBrandProductId("");
    setFabricTypeId("");
    setQuantity("");
    setWeight("");
    setSupplierRollId("");
    setSourceRollId("");
    setFilmType("gloss");
    setIsMetallic(false);
    setColorId("");
    setGrossWeight("");
    setCoreWeight("");
  };

  const handleRemoveItem = (key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedBillVal = Number(manualBillValue);
    if (isSaving || items.length === 0) return;
    if (isNaN(parsedBillVal) || parsedBillVal <= 0) {
      setErrorText("Please enter a positive manual bill value.");
      return;
    }

    setIsSaving(true);
    setErrorText(null);
    setSuccessText(null);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("total_bill_value", String(parsedBillVal));

      items.forEach((item) => {
        formData.append("department", item.department);
        formData.append("roto_product_id", item.rotoProductId);
        formData.append("offset_product_id", item.offsetProductId);
        formData.append("finishing_product_id", item.finishingProductId ?? "");
        formData.append("fabric_type_id", item.fabricTypeId);
        formData.append("lamination_type", item.laminationType);
        formData.append("offset_type", item.offsetType);
        formData.append("quantity", String(item.quantity));
        formData.append("weight", String(item.weight));
        formData.append("rate", "0");
        formData.append("supplier_roll_id", item.supplierRollId);
        formData.append("source_roll_id", item.sourceRollId);
        formData.append("film_type", item.filmType);
        formData.append("is_metallic", String(item.isMetallic));
        formData.append("color_id", item.colorId);
        formData.append("gross_weight", item.grossWeight ? String(item.grossWeight) : "");
        formData.append("core_weight", item.coreWeight ? String(item.coreWeight) : "");
      });

      const result = await saveProductPurchase(formData);
      if (!result.success) {
        setErrorText(result.error || "Failed to save product purchase.");
        setIsSaving(false);
        return;
      }
      setSuccessText("Product Purchase recorded successfully!");
      if (result.createdRollNumbers && result.createdRollNumbers.length > 0) {
        setPurchasedRollTags(result.createdRollNumbers);
      }
      setItems([]);
      setManualBillValue("");
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

      {purchasedRollTags.length > 0 && (
        <div className="p-4 bg-emerald-50/90 border-2 border-emerald-300 rounded-lg shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Purchase Recorded Successfully! Please note down these generated Roll Numbers for physical marking:</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {purchasedRollTags.map((tag, idx) => (
              <span key={idx} className="bg-emerald-900 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-md shadow-xs">
                Item #{idx + 1}: {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Basic Header Details: Client Name, Bill Number, Bill Value */}
      <input type="hidden" name="purchase_date" value={selectedDate} />
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5 col-span-1">
          <Label htmlFor="supplier_name" className="text-xs font-semibold text-slate-700">Client / Supplier Name</Label>
          <select
            id="supplier_name"
            name="supplier_name"
            required
            className="w-full h-9 text-xs border border-slate-200 rounded-md bg-background px-3 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
          >
            <option value="">Select Supplier...</option>
            {sortedSuppliers.map((sup) => (
              <option key={sup.id} value={sup.customer_name}>
                {sup.customer_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 col-span-1">
          <Label htmlFor="bill_number" className="text-xs font-semibold text-slate-700">Bill No.</Label>
          <Input id="bill_number" name="bill_number" type="text" placeholder="Enter Bill No." required className="h-9 text-xs font-semibold font-mono" />
        </div>

        <div className="space-y-1.5 col-span-1">
          <Label htmlFor="total_bill_value" className="text-xs font-semibold text-slate-700">Bill Value (₹)</Label>
          <Input
            id="total_bill_value"
            name="total_bill_value"
            type="number"
            placeholder="Enter Bill Value..."
            value={manualBillValue}
            onChange={(e) => setManualBillValue(e.target.value)}
            required
            className="h-9 text-xs font-semibold font-mono"
          />
        </div>
      </div>

      {/* Item Creator Block */}
      <div className="p-4 bg-slate-50/70 rounded-lg border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Department & Product Specifications</span>
        </div>

        <div className="space-y-4">
          {/* Department Selection */}
          <div className="space-y-1.5 max-w-xs">
            <Label className="text-xs font-bold text-slate-700">Department</Label>
            <select
              value={department}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="w-full h-9 text-xs border border-slate-300 rounded bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
            >
              <option value="">Select Department...</option>
              <option value="fabric">FABRIC</option>
              <option value="roto-printing">ROTO PRINTING</option>
              <option value="lamination">LAMINATION</option>
              <option value="offset-printing">OFFSET PRINTING</option>
              <option value="finishing">FINISHING / BAGS</option>
            </select>
          </div>

          {/* Department A: FABRIC */}
          {department === "fabric" && (
            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Fabric ID / Spec</Label>
                  <select
                    value={fabricTypeId}
                    onChange={(e) => setFabricTypeId(e.target.value)}
                    className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                  >
                    <option value="">Select Fabric Spec...</option>
                    {sortedFabricTypes.map((fab) => (
                      <option key={fab.id} value={fab.id}>{fab.fabric_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Gross Weight (KG)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="Enter Gross Wt" value={grossWeight} onChange={(e) => handleGrossChange(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Core Weight (KG)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="Enter Core Wt" value={coreWeight} onChange={(e) => handleCoreChange(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Net Weight (KG)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="Enter Net Wt" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Meters</Label>
                  <Input type="number" min="0" placeholder="Enter Meters" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Avg Mtr Wt (g/m)</Label>
                  <div className="h-8 text-xs font-mono font-bold bg-slate-100 border border-slate-200 rounded px-2 flex items-center text-slate-700">
                    {computedAvgMtrWeight !== null ? `${computedAvgMtrWeight} g/m` : "-"}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Supplier Roll ID (Optional)</Label>
                  <div className="flex gap-2">
                    <Input type="text" placeholder="Roll ID" value={supplierRollId} onChange={(e) => setSupplierRollId(e.target.value)} className="h-8 text-xs font-mono font-semibold" />
                    <Button type="button" onClick={handleAddItem} className="h-8 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-3">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Department B: ROTO PRINTING */}
          {department === "roto-printing" && (
            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Film Type</Label>
                  <select value={filmType} onChange={(e) => setFilmType(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold">
                    <option value="gloss">Gloss</option>
                    <option value="matt">Matt</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Roto Printing Brand</Label>
                  <select
                    value={brandProductId}
                    onChange={(e) => setBrandProductId(e.target.value)}
                    className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                  >
                    <option value="">Select Roto Brand...</option>
                    {sortedRotoProducts.map((prod) => (
                      <option key={prod.id} value={prod.id}>{prod.brand}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Color</Label>
                  <select value={colorId} onChange={(e) => setColorId(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold">
                    <option value="">Select Color...</option>
                    {sortedColors.map((c) => (
                      <option key={c.id} value={c.id}>{c.color_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Weight (KG)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="Enter Wt" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Meters</Label>
                  <Input type="number" min="0" placeholder="Enter Meters" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Avg Mtr Wt (g/m)</Label>
                  <div className="h-8 text-xs font-mono font-bold bg-slate-100 border border-slate-200 rounded px-2 flex items-center text-slate-700">
                    {computedAvgMtrWeight !== null ? `${computedAvgMtrWeight} g/m` : "-"}
                  </div>
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <input type="checkbox" id="is_metallic" checked={isMetallic} onChange={(e) => setIsMetallic(e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                  <Label htmlFor="is_metallic" className="text-xs font-bold text-slate-700 cursor-pointer">Metallic Film?</Label>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Supplier Roll ID (Optional)</Label>
                  <div className="flex gap-2">
                    <Input type="text" placeholder="Roll ID" value={supplierRollId} onChange={(e) => setSupplierRollId(e.target.value)} className="h-8 text-xs font-mono font-semibold" />
                    <Button type="button" onClick={handleAddItem} className="h-8 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-3">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Roto Roll
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Department C: LAMINATION */}
          {department === "lamination" && (
            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Fabric Spec ID</Label>
                  <select
                    value={fabricTypeId}
                    onChange={(e) => setFabricTypeId(e.target.value)}
                    className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                  >
                    <option value="">Select Fabric Spec...</option>
                    {sortedFabricTypes.map((fab) => (
                      <option key={fab.id} value={fab.id}>{fab.fabric_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Lamination Type</Label>
                  <select value={laminationType} onChange={(e) => setLaminationType(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-bold">
                    <option value="BOX">BOX</option>
                    <option value="F_S">F/S</option>
                    <option value="H_S">H/S</option>
                    <option value="PLAIN">PLAIN</option>
                    <option value="NW">NW</option>
                  </select>
                </div>

                {["BOX", "F_S", "H_S"].includes(laminationType) ? (
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-700">Roto Printing Brand</Label>
                    <select
                      value={brandProductId}
                      onChange={(e) => setBrandProductId(e.target.value)}
                      className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                    >
                      <option value="">Select Roto Brand...</option>
                      {sortedRotoProducts.map((prod) => (
                        <option key={prod.id} value={prod.id}>{prod.brand}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-700">Film Type</Label>
                    <select value={filmType} onChange={(e) => setFilmType(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold">
                      <option value="gloss">Gloss</option>
                      <option value="matt">Matt</option>
                    </select>
                  </div>
                )}
              </div>

              {["BOX", "F_S", "H_S"].includes(laminationType) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-700">Film Type</Label>
                    <select value={filmType} onChange={(e) => setFilmType(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold">
                      <option value="gloss">Gloss</option>
                      <option value="matt">Matt</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input type="checkbox" id="lam_is_metallic" checked={isMetallic} onChange={(e) => setIsMetallic(e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                    <Label htmlFor="lam_is_metallic" className="text-xs font-bold text-slate-700 cursor-pointer">Metallic?</Label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Weight (KG)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="Enter Wt" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Meters</Label>
                  <Input type="number" min="0" placeholder="Enter Meters" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Avg Mtr Wt (g/m)</Label>
                  <div className="h-8 text-xs font-mono font-bold bg-slate-100 border border-slate-200 rounded px-2 flex items-center text-slate-700">
                    {computedAvgMtrWeight !== null ? `${computedAvgMtrWeight} g/m` : "-"}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="button" onClick={handleAddItem} className="h-8 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-4">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Lamination Roll
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Department D: OFFSET PRINTING */}
          {department === "offset-printing" && (
            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Fabric Spec ID</Label>
                  <select
                    value={fabricTypeId}
                    onChange={(e) => setFabricTypeId(e.target.value)}
                    className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                  >
                    <option value="">Select Fabric Spec...</option>
                    {sortedFabricTypes.map((fab) => (
                      <option key={fab.id} value={fab.id}>{fab.fabric_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Offset Type</Label>
                  <select value={offsetType} onChange={(e) => setOffsetType(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-bold">
                    <option value="FABRIC">PLAIN (FABRIC)</option>
                    <option value="NW_LAM">NW_LAM</option>
                    <option value="PLAIN_LAM">PLAIN_LAM</option>
                    <option value="NW">NW</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Offset Brand ID</Label>
                  <select
                    value={brandProductId}
                    onChange={(e) => setBrandProductId(e.target.value)}
                    className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                  >
                    <option value="">Select Offset Brand...</option>
                    {sortedOffsetProducts.map((prod) => (
                      <option key={prod.id} value={prod.id}>{prod.brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Weight (KG)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="Enter Wt" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Meters</Label>
                  <Input type="number" min="0" placeholder="Enter Meters" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Avg Mtr Wt (g/m)</Label>
                  <div className="h-8 text-xs font-mono font-bold bg-slate-100 border border-slate-200 rounded px-2 flex items-center text-slate-700">
                    {computedAvgMtrWeight !== null ? `${computedAvgMtrWeight} g/m` : "-"}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Supplier Roll ID (Optional)</Label>
                  <div className="flex gap-2">
                    <Input type="text" placeholder="Roll ID" value={supplierRollId} onChange={(e) => setSupplierRollId(e.target.value)} className="h-8 text-xs font-mono font-semibold" />
                    <Button type="button" onClick={handleAddItem} className="h-8 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-3">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Department E: FINISHING / BAGS */}
          {department === "finishing" && (
            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Category</Label>
                  <select
                    value={sourceType}
                    onChange={(e) => {
                      setSourceType(e.target.value);
                      setBrandProductId("");
                      setFabricTypeId("");
                      setLaminationType("PLAIN");
                      setOffsetType("FABRIC");
                    }}
                    className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-bold"
                  >
                    <option value="fabric">Fabric Bags</option>
                    <option value="lamination">Lamination Bags</option>
                    <option value="offset">Offset Bags</option>
                  </select>
                </div>

                {/* Sub-fields for FABRIC BAGS */}
                {sourceType === "fabric" && (
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-700">Fabric Spec ID</Label>
                    <select
                      value={fabricTypeId}
                      onChange={(e) => setFabricTypeId(e.target.value)}
                      className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                    >
                      <option value="">Select Fabric Spec...</option>
                      {sortedFabricTypes.map((fab) => (
                        <option key={fab.id} value={fab.id}>{fab.fabric_name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sub-fields for LAMINATION BAGS */}
                {sourceType === "lamination" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-700">Lamination Type</Label>
                      <select value={laminationType} onChange={(e) => setLaminationType(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-bold">
                        <option value="BOX">BOX</option>
                        <option value="F_S">F/S</option>
                        <option value="H_S">H/S</option>
                        <option value="PLAIN">PLAIN</option>
                        <option value="NW">NW</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-700">Fabric Spec ID</Label>
                      <select
                        value={fabricTypeId}
                        onChange={(e) => setFabricTypeId(e.target.value)}
                        className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                      >
                        <option value="">Select Fabric Spec...</option>
                        {sortedFabricTypes.map((fab) => (
                          <option key={fab.id} value={fab.id}>{fab.fabric_name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Sub-fields for OFFSET BAGS */}
                {sourceType === "offset" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-700">Offset Type</Label>
                      <select value={offsetType} onChange={(e) => setOffsetType(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-bold">
                        <option value="FABRIC">PLAIN (FABRIC)</option>
                        <option value="NW_LAM">NW_LAM</option>
                        <option value="PLAIN_LAM">PLAIN_LAM</option>
                        <option value="NW">NW</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-700">Fabric Spec ID</Label>
                      <select
                        value={fabricTypeId}
                        onChange={(e) => setFabricTypeId(e.target.value)}
                        className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                      >
                        <option value="">Select Fabric Spec...</option>
                        {sortedFabricTypes.map((fab) => (
                          <option key={fab.id} value={fab.id}>{fab.fabric_name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Second row for Lamination BOX/F_S/H_S Bags or Offset Bags extra fields */}
              {sourceType === "lamination" && ["BOX", "F_S", "H_S"].includes(laminationType) && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-700">Film Type</Label>
                    <select value={filmType} onChange={(e) => setFilmType(e.target.value)} className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold">
                      <option value="gloss">Gloss</option>
                      <option value="matt">Matt</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-700">Roto Printing Brand</Label>
                    <select
                      value={brandProductId}
                      onChange={(e) => setBrandProductId(e.target.value)}
                      className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                    >
                      <option value="">Select Roto Brand...</option>
                      {sortedRotoProducts.map((prod) => (
                        <option key={prod.id} value={prod.id}>{prod.brand}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input type="checkbox" id="fin_lam_metallic" checked={isMetallic} onChange={(e) => setIsMetallic(e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                    <Label htmlFor="fin_lam_metallic" className="text-xs font-bold text-slate-700 cursor-pointer">Metallic Film?</Label>
                  </div>
                </div>
              )}

              {sourceType === "offset" && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-700">Offset Brand ID</Label>
                    <select
                      value={brandProductId}
                      onChange={(e) => setBrandProductId(e.target.value)}
                      className="w-full h-8 text-[11px] border border-slate-300 rounded bg-white px-2 py-0.5 focus:outline-none font-semibold"
                    >
                      <option value="">Select Offset Brand...</option>
                      {sortedOffsetProducts.map((prod) => (
                        <option key={prod.id} value={prod.id}>{prod.brand}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 items-end pt-1">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">Weight (KG)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="Enter Wt" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">No of Bags</Label>
                  <Input type="number" min="0" placeholder="Enter Bags Count" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-8 text-xs font-semibold font-mono" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <div className="space-y-1.5 w-72">
                  <Label className="text-[11px] font-bold text-slate-700">Supplier Bundle ID (Optional)</Label>
                  <div className="flex gap-2">
                    <Input type="text" placeholder="Bundle ID" value={supplierRollId} onChange={(e) => setSupplierRollId(e.target.value)} className="h-8 text-xs font-mono font-semibold" />
                    <Button type="button" onClick={handleAddItem} className="h-8 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-3">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Bags
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmed items list */}
      {items.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">Added Purchase Items ({items.length})</span>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-200 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="uppercase px-2 py-0.5 bg-emerald-100 rounded text-[10px] font-black text-emerald-900">
                      {item.department.replace("-printing", "")}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">{item.productLabel}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium flex flex-wrap gap-x-3 gap-y-1">
                    {item.fabricLabel && <div>Fabric: <strong>{item.fabricLabel}</strong></div>}
                    {item.filmType && <div>Film: <strong>{item.filmType} {item.isMetallic ? "(Metallic)" : ""}</strong></div>}
                    {item.colorLabel && <div>Color: <strong>{item.colorLabel}</strong></div>}
                    {item.supplierRollId && <div className="text-amber-800 font-mono">Supplier ID: <strong>{item.supplierRollId}</strong></div>}
                    {item.grossWeight !== undefined && <div>Gross: <strong>{item.grossWeight}kg</strong></div>}
                    {item.coreWeight !== undefined && <div>Core: <strong>{item.coreWeight}kg</strong></div>}
                    {item.avgMtrWeight !== undefined && <div>Avg: <strong>{item.avgMtrWeight} g/m</strong></div>}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-slate-700">
                    {formatNumber(item.quantity, 0)} {item.department === "finishing" ? "bags" : "mtrs"} / {formatNumber(item.weight, 1)} kg (Net)
                  </div>
                </div>
                <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveItem(item.key)} className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 shadow-none">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <ConfirmSubmitButton
        confirmTitle="Confirm Product Purchase?"
        confirmDescription={`Record this purchase entry of ₹${formatNumber(Number(manualBillValue) || 0, 2)} and auto-generate stock entries and journal lines.`}
        disabled={items.length === 0}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9"
      >
        Submit Product Purchase
      </ConfirmSubmitButton>
    </form>
  );
}
