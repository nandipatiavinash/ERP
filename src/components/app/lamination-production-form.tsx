"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { showSuccess } from "@/lib/toast";
import { saveLaminationProduction } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { isRedirectError, todayInIndia } from "@/lib/utils";

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
  prefillData?: { lamType: string; fabricTypeId: string; rotoProductId: string } | null;
  permissions?: string[];
  userRole?: string;
}

export function LaminationProductionForm({
  fabricTypes,
  rotoProducts,
  onSuccess,
  rows,
  prefillData,
  permissions = [],
  userRole = "",
}: LaminationProductionFormProps) {
  const canChangeDate = userRole === "admin" || permissions.includes("sales.allow_custom_date");
  const [isPending, startTransition] = useTransition();
  const [lamType, setLamType] = useState<string>("");
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string>("");
  const [selectedRotoProductId, setSelectedRotoProductId] = useState<string>("");

  useEffect(() => {
    if (prefillData) {
      setLamType(prefillData.lamType || "");
      setSelectedFabricTypeId(prefillData.fabricTypeId || "");
      setSelectedRotoProductId(prefillData.rotoProductId || "");
    }
  }, [prefillData]);
  const [weightKg, setWeightKg] = useState<string>("");
  const [grossWeight, setGrossWeight] = useState<string>("");
  const [coreWeight, setCoreWeight] = useState<string>("");
  const [meters, setMeters] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(todayInIndia());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const handleDecimalChange = (value: string, setter: (v: string) => void) => {
    if (value.includes(".")) {
      const parts = value.split(".");
      if (parts[1].length > 1) {
        setter(`${parts[0]}.${parts[1].slice(0, 1)}`);
        return;
      }
    }
    setter(value);
  };

  const handleGrossChange = (val: string) => {
    handleDecimalChange(val, (cleanVal) => {
      setGrossWeight(cleanVal);
      const g = parseFloat(cleanVal);
      const c = parseFloat(coreWeight);
      if (!isNaN(g) && !isNaN(c)) {
        const net = String(Math.max(0, Number((g - c).toFixed(1))));
        setWeightKg(net);
      }
    });
  };

  const handleCoreChange = (val: string) => {
    handleDecimalChange(val, (cleanVal) => {
      setCoreWeight(cleanVal);
      const g = parseFloat(grossWeight);
      const c = parseFloat(cleanVal);
      if (!isNaN(g) && !isNaN(c)) {
        const net = String(Math.max(0, Number((g - c).toFixed(1))));
        setWeightKg(net);
      }
    });
  };

  // Sort fabric types and roto products alphabetically
  const sortedFabricTypes = useMemo(() => {
    return [...fabricTypes].sort((a, b) => (a.fabric_name || "").localeCompare(b.fabric_name || ""));
  }, [fabricTypes]);

  const sortedRotoProducts = useMemo(() => {
    const map = new Map<string, typeof rotoProducts[number]>();
    [...rotoProducts]
      .sort((a, b) => (a.s_no ?? 0) - (b.s_no ?? 0))
      .forEach((p) => {
        if (p.roll_id && !map.has(p.roll_id)) {
          map.set(p.roll_id, p);
        }
      });
    return Array.from(map.values()).sort((a, b) => (a.roll_id || "").localeCompare(b.roll_id || ""));
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
        if (grossWeight) fd.append("gross_weight", grossWeight);
        if (coreWeight) fd.append("core_weight", coreWeight);
        await saveLaminationProduction(fd);
        showSuccess(`Laminated Roll Created!\nID: ${livePreviewId}\nWeight: ${w} KGs\nMeters: ${m} Mtrs`);
        setSuccessMsg(`Lamination roll created: ${livePreviewId}`);
        if (onSuccess) {
          onSuccess({ rollId: livePreviewId, weight: w, meters: m });
        }

        // Reset
        setSelectedFabricTypeId("");
        setSelectedRotoProductId("");
        setWeightKg("");
        setMeters("");
        setGrossWeight("");
        setCoreWeight("");
      } catch (err: any) {
        if (isRedirectError(err)) throw err;
        setErrorMsg(err.message || "Failed to save.");
      }
    });
  };

  const isBrandRequired = ["BOX", "F_S", "H_S"].includes(lamType);

  const confirmSummary = useMemo(() => {
    const fabName = sortedFabricTypes.find((f) => f.id === selectedFabricTypeId)?.fabric_name ?? "";
    const netW = parseFloat(weightKg) || 0;
    const mtrs = parseFloat(meters) || 0;
    const avg = mtrs > 0 ? (netW / mtrs) * 1000 : 0;

    const summaryRows = [
      { label: "FABRIC ID", value: livePreviewId },
      { label: "LAM TYPE", value: lamType },
      { label: "FABRIC TYPE", value: fabName },
    ];

    if (grossWeight) summaryRows.push({ label: "GROSS WEIGHT", value: grossWeight });
    if (coreWeight) summaryRows.push({ label: "CORE WEIGHT", value: coreWeight });

    summaryRows.push(
      { label: "NET WEIGHT", value: String(netW) },
      { label: "NET METERS", value: String(mtrs) },
      { label: "AVERAGE METER WEIGHT", value: String(Math.floor(avg)) }
    );

    return summaryRows;
  }, [livePreviewId, lamType, sortedFabricTypes, selectedFabricTypeId, grossWeight, coreWeight, weightKg, meters]);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Weight */}
        <div className="space-y-1">
          <Label htmlFor="gross_weight" className="text-xs font-semibold text-slate-700">Gross Weight (kg) <span className="text-slate-400 font-normal">(Optional)</span></Label>
          <Input
            id="gross_weight"
            type="number"
            step="0.1"
            placeholder="Enter Gross Weight"
            value={grossWeight}
            onChange={(e) => handleGrossChange(e.target.value)}
            className="h-10 text-sm border-slate-200"
          />
        </div>

        {/* Core Weight */}
        <div className="space-y-1">
          <Label htmlFor="core_weight" className="text-xs font-semibold text-slate-700">Core Weight (kg) <span className="text-slate-400 font-normal">(Optional)</span></Label>
          <Input
            id="core_weight"
            type="number"
            step="0.1"
            placeholder="Enter Core Weight"
            value={coreWeight}
            onChange={(e) => handleCoreChange(e.target.value)}
            className="h-10 text-sm border-slate-200"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="weight_kg" className="text-xs font-semibold text-slate-700">Laminated Roll KGs</Label>
          <Input
            id="weight_kg"
            type="number"
            step="0.1"
            placeholder="Enter Laminated Roll KGs"
            value={weightKg}
            onChange={(e) => handleDecimalChange(e.target.value, setWeightKg)}
            className="h-10 text-sm border-slate-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meters */}
        <div className="space-y-1">
          <Label htmlFor="meters" className="text-xs font-semibold text-slate-700">Laminated Roll Mtrs</Label>
          <Input
            id="meters"
            type="number"
            step="0.1"
            placeholder="Enter Laminated Roll Mtrs"
            value={meters}
            onChange={(e) => handleDecimalChange(e.target.value, setMeters)}
            className="h-10 text-sm border-slate-200"
          />
        </div>
        {/* Entry Date */}
        <div className="space-y-1">
          <Label htmlFor="entry_date" className="text-xs font-semibold text-slate-700">Entry Date</Label>
          <Input
            id="entry_date"
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            disabled={!canChangeDate}
            className="h-10 text-sm border-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
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

      <ConfirmSubmitButton
        confirmTitle="Create production entry?"
        confirmDescription="Confirm the lamination type, fabric type, weight, and meter readings before saving."
        summary={confirmSummary}
        disabled={isPending}
        className="w-fit px-6 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
      >
        {isPending ? "Submitting..." : "Create Production Entry"}
      </ConfirmSubmitButton>
    </form>
  );
}
