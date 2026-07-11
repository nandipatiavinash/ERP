"use client";

import { useState, useTransition, useMemo } from "react";
import { showSuccess } from "@/lib/toast";
import { saveLaminationProduction } from "@/app/(app)/_actions";
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

type FilmRoll = {
  id: string;
  roll_id: string;
  weight_kg: number;
  meters: number;
};

type LaminationProduct = {
  id: string;
  name: string;
};

interface LaminationProductionFormProps {
  fabricTypes: FabricType[];
  rotoProducts: { id: string; roll_id: string; s_no: number }[];
  onSuccess?: (newRollInfo: { rollId: string; weight: number; meters: number }) => void;
  rows?: any[];
}

export function LaminationProductionForm({
  fabricTypes,
  rotoProducts,
  onSuccess,
  rows,
}: LaminationProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [lamType, setLamType] = useState<string>("");
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string>("");
  const [selectedRotoProductId, setSelectedRotoProductId] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [meters, setMeters] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sort fabric types and roto products alphabetically
  const sortedFabricTypes = useMemo(() => {
    return [...fabricTypes].sort((a, b) => a.fabric_name.localeCompare(b.fabric_name));
  }, [fabricTypes]);

  const sortedRotoProducts = useMemo(() => {
    const map = new Map<string, typeof rotoProducts[number]>();
    [...rotoProducts]
      .sort((a, b) => a.s_no - b.s_no)
      .forEach((p) => {
        if (!map.has(p.roll_id)) {
          map.set(p.roll_id, p);
        }
      });
    return Array.from(map.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));
  }, [rotoProducts]);

  // Compute live preview of lamination roll_id
  const livePreviewId = useMemo(() => {
    const fabType = fabricTypes.find((t) => t.id === selectedFabricTypeId);
    const fabName = fabType ? fabType.fabric_name : "FABRIC-TYPE";

    let brandName = "PLAIN";
    if (["BOX", "F_S", "H_S"].includes(lamType)) {
      const rotoProduct = rotoProducts.find((p) => p.id === selectedRotoProductId);
      brandName = rotoProduct ? rotoProduct.roll_id : "Select Brand";
    } else if (lamType === "NW") {
      brandName = "NW";
    }

    let suffix = "";
    if (lamType === "PLAIN") suffix = "";
    else if (lamType === "NW") suffix = "";
    else if (lamType === "BOX") suffix = "B";
    else if (lamType === "F_S") suffix = "F";
    else if (lamType === "H_S") suffix = "H";

    if (lamType === "PLAIN" || lamType === "NW") {
      return `${brandName}(${fabName})`.toUpperCase();
    } else {
      return `${brandName}(${fabName})(${suffix})`.toUpperCase();
    }
  }, [lamType, selectedFabricTypeId, selectedRotoProductId, fabricTypes, rotoProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!lamType) {
      setErrorMsg("Lamination Type is required.");
      return;
    }
    if (!selectedFabricTypeId) {
      setErrorMsg("Fabric Type is required.");
      return;
    }
    if (["BOX", "F_S", "H_S"].includes(lamType) && !selectedRotoProductId) {
      setErrorMsg("Brand / Product is required for BOX/FS/HS types.");
      return;
    }
    const w = parseFloat(weightKg);
    const m = parseFloat(meters);
    if (!w || w <= 0 || !m || m <= 0) {
      setErrorMsg("KGs and Meters must be positive.");
      return;
    }

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("lam_type", lamType);
        fd.append("fabric_type_id", selectedFabricTypeId);
        if (["BOX", "F_S", "H_S"].includes(lamType)) {
          fd.append("roto_product_id", selectedRotoProductId);
        }
        fd.append("weight_kg", String(w));
        fd.append("meters", String(m));
        fd.append("entry_date", entryDate);

        await saveLaminationProduction(fd);
        showSuccess("Submitted successfully!");
        setSuccessMsg(`Lamination roll created: ${livePreviewId}`);

        if (onSuccess) {
          onSuccess({ rollId: livePreviewId, weight: w, meters: m });
        }

        // Reset
        setSelectedFabricTypeId("");
        setSelectedRotoProductId("");
        setWeightKg("");
        setMeters("");
      } catch (err: any) {
        if (isRedirectError(err)) throw err;
        setErrorMsg(err.message || "Failed to save.");
      }
    });
  };

  const isBrandRequired = ["BOX", "F_S", "H_S"].includes(lamType);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{successMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lamination Type */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Lamination Type</Label>
          <Select value={lamType} onValueChange={(val) => { setLamType(val); setSelectedFabricTypeId(""); setSelectedRotoProductId(""); }}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="Select lamination type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PLAIN">PLAIN</SelectItem>
              <SelectItem value="BOX">BOX</SelectItem>
              <SelectItem value="F_S">F/S</SelectItem>
              <SelectItem value="H_S">H/S</SelectItem>
              <SelectItem value="NW">NW</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fabric Type */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Select Fabric Type</Label>
          <Select value={selectedFabricTypeId} onValueChange={setSelectedFabricTypeId}>
            <SelectTrigger className="h-10 border-slate-200 text-xs">
              <SelectValue placeholder="Select fabric type" />
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

        {/* Brand Dropdown (Roto Products) */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Select Brand (Roto Printed Spec)</Label>
          <Select
            value={selectedRotoProductId}
            onValueChange={setSelectedRotoProductId}
            disabled={!isBrandRequired}
          >
            <SelectTrigger className="h-10 border-slate-200 text-xs disabled:opacity-50 font-mono">
              <SelectValue placeholder={isBrandRequired ? "Select roto spec" : "No specification required"} />
            </SelectTrigger>
            <SelectContent>
              {sortedRotoProducts.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs font-mono">
                  {p.roll_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KGs */}
        <div className="space-y-1">
          <Label htmlFor="weight_kg" className="text-xs font-semibold text-slate-700">Laminated Roll KGs</Label>
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

        {/* Meters */}
        <div className="space-y-1">
          <Label htmlFor="meters" className="text-xs font-semibold text-slate-700">Laminated Roll Mtrs</Label>
          <Input
            id="meters"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={meters}
            onChange={(e) => setMeters(e.target.value)}
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
