"use client";

import { useState, useTransition, useMemo } from "react";
import { showSuccess } from "@/lib/toast";
import { saveOffsetProduction } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { isRedirectError } from "@/lib/utils";

type FabricType = {
  id: string;
  fabric_name: string;
};

type LaminationRoll = {
  id: string;
  roll_id: string;
  lam_type: string;
  weight_kg: number;
  fabric_type_id?: string | null;
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
  rows?: any[];
}

export function OffsetProductionForm({
  fabricTypes,
  laminationRolls,
  offsetProducts,
  onSuccess,
  rows,
}: OffsetProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [offsetType, setOffsetType] = useState<string>("");
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string>("");
  const [selectedLamBrand, setSelectedLamBrand] = useState<string>("none");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sort lists alphabetically
  const sortedFabricTypes = useMemo(() => {
    return [...fabricTypes].sort((a, b) => a.fabric_name.localeCompare(b.fabric_name));
  }, [fabricTypes]);

  const sortedOffsetProducts = useMemo(() => {
    return [...offsetProducts].sort((a, b) => a.brand.localeCompare(b.brand));
  }, [offsetProducts]);

  // Group lamination brands based on offsetType
  const laminationBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    const rolls = offsetType === "NW_LAM"
      ? laminationRolls.filter((r) => r.lam_type === "NW")
      : offsetType === "PLAIN_LAM"
      ? laminationRolls.filter((r) => r.lam_type === "PLAIN")
      : [];

    rolls.forEach((roll) => {
      const match = roll.roll_id.match(/^([^(]+)/);
      if (match) {
        brandsSet.add(match[1].trim());
      } else {
        brandsSet.add(roll.roll_id);
      }
    });
    return Array.from(brandsSet).sort((a, b) => a.localeCompare(b));
  }, [offsetType, laminationRolls]);

  // Find matching roll to extract fabric_type_id and name
  const selectedLamRoll = useMemo(() => {
    if (!selectedLamBrand || selectedLamBrand === "none") return null;
    return laminationRolls.find((r) => {
      const match = r.roll_id.match(/^([^(]+)/);
      const brandName = match ? match[1].trim() : r.roll_id;
      return brandName === selectedLamBrand;
    });
  }, [selectedLamBrand, laminationRolls]);

  // Compute live preview of offset roll_id
  const livePreviewId = useMemo(() => {
    const brand = offsetProducts.find((p) => p.id === selectedBrandId);
    const brandName = brand ? brand.brand : "BRAND";

    let fabricName = "FABRIC-TYPE";
    if (offsetType === "FABRIC") {
      const fab = fabricTypes.find((t) => t.id === selectedFabricTypeId);
      if (fab) fabricName = fab.fabric_name;
    } else if (["NW_LAM", "PLAIN_LAM"].includes(offsetType)) {
      if (selectedLamRoll) {
        const match = selectedLamRoll.roll_id.match(/^([^(]+)\(([^)]+)\)/);
        if (match) fabricName = match[2];
        else fabricName = selectedLamRoll.fabric_types?.fabric_name || "FABRIC-TYPE";
      }
    } else if (offsetType === "NW") {
      fabricName = "NW";
    }

    return `${brandName}(${fabricName})()`;
  }, [offsetType, selectedFabricTypeId, selectedLamRoll, selectedBrandId, fabricTypes, offsetProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!offsetType) {
      setErrorMsg("Offset Type is required.");
      return;
    }
    if (!selectedBrandId || selectedBrandId === "none") {
      setErrorMsg("Brand is required.");
      return;
    }
    if (offsetType === "FABRIC" && !selectedFabricTypeId) {
      setErrorMsg("Fabric Type is required.");
      return;
    }
    if (["NW_LAM", "PLAIN_LAM"].includes(offsetType) && (!selectedLamBrand || selectedLamBrand === "none")) {
      setErrorMsg("Laminated Brand is required.");
      return;
    }
    if (["NW_LAM", "PLAIN_LAM"].includes(offsetType) && !selectedLamRoll?.fabric_type_id) {
      setErrorMsg("Unable to resolve fabric type from selected laminated brand.");
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
        } else if (["NW_LAM", "PLAIN_LAM"].includes(offsetType) && selectedLamRoll?.fabric_type_id) {
          fd.append("fabric_type_id", selectedLamRoll.fabric_type_id);
        }
        fd.append("weight_kg", String(w));
        fd.append("entry_date", entryDate);

        await saveOffsetProduction(fd);
        showSuccess("Submitted successfully!");
        setSuccessMsg(`Offset roll created: ${livePreviewId}`);

        if (onSuccess) {
          onSuccess({ rollId: livePreviewId, weight: w });
        }

        // Reset
        setSelectedFabricTypeId("");
        setSelectedLamBrand("none");
        setWeightKg("");
      } catch (err: any) {
        if (isRedirectError(err)) throw err;
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type Select */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Offset Type</Label>
          <Select value={offsetType} onValueChange={(val) => { setOffsetType(val); setSelectedFabricTypeId(""); setSelectedLamBrand("none"); }}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="Select offset type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FABRIC">Fabric Roll</SelectItem>
              <SelectItem value="NW">NW</SelectItem>
              <SelectItem value="NW_LAM">NW/LAM</SelectItem>
              <SelectItem value="PLAIN_LAM">PLAIN/LAM</SelectItem>
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
              {sortedOffsetProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fabric Type */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Fabric Type (For FABRIC Type)</Label>
          <Select
            value={selectedFabricTypeId}
            onValueChange={setSelectedFabricTypeId}
            disabled={!isFabricRequired}
          >
            <SelectTrigger className="h-10 border-slate-200 text-xs disabled:opacity-50">
              <SelectValue placeholder={isFabricRequired ? "Select fabric type" : "No fabric type required"} />
            </SelectTrigger>
            <SelectContent>
              {sortedFabricTypes.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  {t.fabric_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Laminated Brand */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Laminated Brand (For LAM Types)</Label>
          <Select
            value={selectedLamBrand}
            onValueChange={setSelectedLamBrand}
            disabled={!isLamRequired}
          >
            <SelectTrigger className="h-10 border-slate-200 text-xs disabled:opacity-50">
              <SelectValue placeholder={isLamRequired ? "Select laminated brand" : "No brand required"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select laminated brand</SelectItem>
              {laminationBrands.map((b) => (
                <SelectItem key={b} value={b} className="text-xs">
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KGs */}
        <div className="space-y-1">
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
        className="w-fit px-6 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Production"}
      </Button>
    </form>
  );
}
