"use client";

import { useState, useTransition, useMemo } from "react";
import { saveOffsetProduction } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type FabricType = {
  id: string;
  fabric_name: string;
};

type LaminationRoll = {
  id: string;
  roll_id: string;
  lam_type: string;
  weight_kg: number;
  fabric_types?: {
    fabric_name: string;
  } | null;
};

type OffsetProduct = {
  id: string;
  brand: string;
};

interface OffsetProductionFormProps {
  fabricTypes: FabricType[];
  laminationRolls: LaminationRoll[];
  offsetProducts: OffsetProduct[];
  onSuccess?: (newRollInfo: { rollId: string; weight: number }) => void;
}

export function OffsetProductionForm({
  fabricTypes,
  laminationRolls,
  offsetProducts,
  onSuccess,
}: OffsetProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [offsetType, setOffsetType] = useState<string>("FABRIC");
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string>("");
  const [selectedLamId, setSelectedLamId] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter lamination rolls based on selected offset type
  const filteredLamRolls = useMemo(() => {
    if (offsetType === "NW_LAM") {
      return laminationRolls.filter((r) => r.lam_type === "NW");
    }
    if (offsetType === "PLAIN_LAM") {
      return laminationRolls.filter((r) => r.lam_type === "PLAIN");
    }
    return [];
  }, [offsetType, laminationRolls]);

  // Compute live preview of offset roll_id
  const livePreviewId = useMemo(() => {
    const brand = offsetProducts.find((p) => p.id === selectedBrandId);
    const brandName = brand ? brand.brand : "BRAND";

    let fabricName = "FABRIC-TYPE";
    if (offsetType === "FABRIC") {
      const fab = fabricTypes.find((t) => t.id === selectedFabricTypeId);
      if (fab) fabricName = fab.fabric_name;
    } else if (["NW_LAM", "PLAIN_LAM"].includes(offsetType)) {
      const lam = laminationRolls.find((r) => r.id === selectedLamId);
      if (lam && lam.fabric_types) fabricName = lam.fabric_types.fabric_name;
    }

    if (offsetType === "NW") {
      return `${brandName}(NW)`;
    } else if (offsetType === "NW_LAM") {
      return `${brandName}(NW-LAM-${fabricName})`;
    } else if (offsetType === "PLAIN_LAM") {
      return `${brandName}(${fabricName}-P)`;
    } else if (offsetType === "FABRIC") {
      return `${brandName}(${fabricName})`;
    }
    return "";
  }, [offsetType, selectedFabricTypeId, selectedLamId, selectedBrandId, fabricTypes, laminationRolls, offsetProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedBrandId) {
      setErrorMsg("Brand is required.");
      return;
    }
    if (offsetType === "FABRIC" && !selectedFabricTypeId) {
      setErrorMsg("Fabric Type is required for FABRIC type.");
      return;
    }
    if (["NW_LAM", "PLAIN_LAM"].includes(offsetType) && !selectedLamId) {
      setErrorMsg("Lamination Roll is required.");
      return;
    }
    const w = parseFloat(weightKg);
    if (!w || w <= 0) {
      setErrorMsg("KGs must be positive.");
      return;
    }

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("offset_type", offsetType);
        fd.append("brand_id", selectedBrandId);
        if (offsetType === "FABRIC") {
          fd.append("fabric_type_id", selectedFabricTypeId);
        }
        if (["NW_LAM", "PLAIN_LAM"].includes(offsetType)) {
          fd.append("source_lam_roll_id", selectedLamId);
        }
        fd.append("weight_kg", String(w));
        fd.append("entry_date", entryDate);

        await saveOffsetProduction(fd);
        setSuccessMsg(`Offset roll created: ${livePreviewId}`);

        if (onSuccess) {
          onSuccess({ rollId: livePreviewId, weight: w });
        }

        // Reset
        setSelectedFabricTypeId("");
        setSelectedLamId("");
        setWeightKg("");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save.");
      }
    });
  };

  const isFabricRequired = offsetType === "FABRIC";
  const isLamRequired = ["NW_LAM", "PLAIN_LAM"].includes(offsetType);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{successMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Field */}
        <div className="space-y-1 md:col-span-1">
          <Label htmlFor="entry_date" className="text-xs font-semibold text-slate-700">Production Date</Label>
          <Input
            id="entry_date"
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="h-10 text-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        {/* Type Select */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Offset Type</Label>
          <Select value={offsetType} onValueChange={(val) => { setOffsetType(val); setSelectedFabricTypeId(""); setSelectedLamId(""); }}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FABRIC">Fabric Roll</SelectItem>
              <SelectItem value="NW">NW (Non-Woven Roll)</SelectItem>
              <SelectItem value="NW_LAM">NW LAM (Laminated NW)</SelectItem>
              <SelectItem value="PLAIN_LAM">PLAIN LAM (Laminated Plain)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand/Product Select */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Select Brand (Product ID)</Label>
          <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {offsetProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fabric Type (FABRIC type only) */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Fabric Type (For FABRIC Type)</Label>
          <Select
            value={selectedFabricTypeId}
            onValueChange={setSelectedFabricTypeId}
            disabled={!isFabricRequired}
          >
            <SelectTrigger className="h-10 border-slate-200 text-xs disabled:opacity-50">
              <SelectValue placeholder={isFabricRequired ? "Select fabric type" : "Disabled"} />
            </SelectTrigger>
            <SelectContent>
              {fabricTypes.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  {t.fabric_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Laminated Roll (NW_LAM or PLAIN_LAM types only) */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Laminated Roll (For LAM Types)</Label>
          <Select
            value={selectedLamId}
            onValueChange={setSelectedLamId}
            disabled={!isLamRequired}
          >
            <SelectTrigger className="h-10 border-slate-200 font-mono text-xs disabled:opacity-50">
              <SelectValue placeholder={isLamRequired ? "Select laminated roll" : "Disabled"} />
            </SelectTrigger>
            <SelectContent>
              {filteredLamRolls.map((r) => (
                <SelectItem key={r.id} value={r.id} className="font-mono text-xs">
                  {r.roll_id} ({r.weight_kg}kg)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KGs */}
        <div className="space-y-1 md:col-span-1">
          <Label htmlFor="weight_kg" className="text-xs font-semibold text-slate-700">Offset Roll KGs</Label>
          <Input
            id="weight_kg"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="h-10 text-sm border-slate-200"
          />
        </div>
      </div>

      {/* Live Preview Roll ID */}
      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/40 flex flex-col gap-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Generated ID Preview</span>
        <Badge className="w-fit text-sm font-mono border border-amber-200 bg-amber-100/50 text-amber-900 py-1 px-2.5 rounded-md">
          {livePreviewId}
        </Badge>
      </div>

      <Button
        type="submit"
        className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Production"}
      </Button>
    </form>
  );
}
