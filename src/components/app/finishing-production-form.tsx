"use client";

import { useState, useTransition, useMemo } from "react";
import { showSuccess } from "@/lib/toast";
import { saveFinishingBundle } from "@/app/(app)/_actions";
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
  fabric_type_id?: string | null;
};

type OffsetRoll = {
  id: string;
  roll_id: string;
  fabric_type_id?: string | null;
};

interface FinishingProductionFormProps {
  fabricTypes: FabricType[];
  laminationRolls: LaminationRoll[];
  offsetRolls: OffsetRoll[];
  onSuccess?: (newBundleInfo: { bundleId: string; numBags: number; weight: number }) => void;
  rows?: any[];
}

export function FinishingProductionForm({
  fabricTypes,
  laminationRolls,
  offsetRolls,
  onSuccess,
  rows,
}: FinishingProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [finishType, setFinishType] = useState<string>("");
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string>("");
  const [selectedLamRollId, setSelectedLamRollId] = useState<string>("");
  const [selectedOffsetRollId, setSelectedOffsetRollId] = useState<string>("");
  const [numBags, setNumBags] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const sortedFabricTypes = useMemo(() => {
    if (!fabricTypes) return [];
    return [...fabricTypes].sort((a, b) => (a.fabric_name || "").localeCompare(b.fabric_name || ""));
  }, [fabricTypes]);

  const uniqueLaminationRolls = useMemo(() => {
    if (!laminationRolls) return [];
    const map = new Map<string, LaminationRoll>();
    laminationRolls.forEach((r) => { if (!map.has(r.roll_id)) map.set(r.roll_id, r); });
    return Array.from(map.values()).sort((a, b) => (a.roll_id || "").localeCompare(b.roll_id || ""));
  }, [laminationRolls]);

  const uniqueOffsetRolls = useMemo(() => {
    if (!offsetRolls) return [];
    const map = new Map<string, OffsetRoll>();
    offsetRolls.forEach((r) => { if (!map.has(r.roll_id)) map.set(r.roll_id, r); });
    return Array.from(map.values()).sort((a, b) => (a.roll_id || "").localeCompare(b.roll_id || ""));
  }, [offsetRolls]);

  const selectedLamRoll = useMemo(
    () => laminationRolls?.find((r) => r.id === selectedLamRollId) || null,
    [selectedLamRollId, laminationRolls]
  );
  const selectedOffsetRoll = useMemo(
    () => offsetRolls?.find((r) => r.id === selectedOffsetRollId) || null,
    [selectedOffsetRollId, offsetRolls]
  );

  const livePreviewId = useMemo(() => {
    const bags = parseInt(numBags, 10) || 0;
    const kgs = parseFloat(weightKg) || 0;
    const suffix = bags > 0 && kgs > 0 ? ` | ${bags} pcs | ${kgs} kg` : "";

    if (finishType === "FABRIC") {
      const fab = fabricTypes?.find((t) => t.id === selectedFabricTypeId);
      return fab ? `PLAIN(${fab.fabric_name})${suffix}`.toUpperCase() : "SELECT FABRIC TYPE";
    }
    if (finishType === "LAMINATION") {
      return selectedLamRoll ? `${selectedLamRoll.roll_id.toUpperCase()}${suffix}` : "SELECT LAMINATION ROLL";
    }
    if (finishType === "OFFSET") {
      return selectedOffsetRoll ? `${selectedOffsetRoll.roll_id.toUpperCase()}${suffix}` : "SELECT OFFSET ROLL";
    }
    return "SELECT TYPE";
  }, [finishType, selectedFabricTypeId, selectedLamRoll, selectedOffsetRoll, fabricTypes, numBags, weightKg]);

  const resetSelections = () => {
    setSelectedFabricTypeId("");
    setSelectedLamRollId("");
    setSelectedOffsetRollId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!finishType) { setErrorMsg("Finishing Type is required."); return; }
    if (finishType === "FABRIC" && !selectedFabricTypeId) { setErrorMsg("Fabric Type is required."); return; }
    if (finishType === "LAMINATION" && !selectedLamRollId) { setErrorMsg("Lamination Roll is required."); return; }
    if (finishType === "OFFSET" && !selectedOffsetRollId) { setErrorMsg("Offset Roll is required."); return; }

    const bags = parseInt(numBags, 10);
    const w = parseFloat(weightKg);
    if (!bags || bags <= 0 || !w || w <= 0) {
      setErrorMsg("Number of Bags and KGs must be positive.");
      return;
    }

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("finish_type", finishType);
        fd.append("num_bags", String(bags));
        fd.append("weight_kg", String(w));
        fd.append("entry_date", entryDate);

        if (finishType === "FABRIC") {
          fd.append("fabric_type_id", selectedFabricTypeId);
        } else if (finishType === "LAMINATION") {
          fd.append("lam_roll_id", selectedLamRollId);
          if (selectedLamRoll?.fabric_type_id) fd.append("fabric_type_id", selectedLamRoll.fabric_type_id);
        } else if (finishType === "OFFSET") {
          fd.append("offset_roll_id", selectedOffsetRollId);
          if (selectedOffsetRoll?.fabric_type_id) fd.append("fabric_type_id", selectedOffsetRoll.fabric_type_id);
        }

        const res = await saveFinishingBundle(fd);
        showSuccess("Submitted successfully!");
        setSuccessMsg(`Finishing bundle created: ${res?.bundle_id || livePreviewId}`);
        if (onSuccess) onSuccess({ bundleId: res?.bundle_id || livePreviewId, numBags: bags, weight: w });

        setFinishType("");
        resetSelections();
        setNumBags("");
        setWeightKg("");
      } catch (err: any) {
        if (isRedirectError(err)) throw err;
        setErrorMsg(err.message || "Failed to save.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{successMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Department / Type</Label>
          <Select value={finishType} onValueChange={(val) => { setFinishType(val); resetSelections(); }}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FABRIC">Fabric</SelectItem>
              <SelectItem value="LAMINATION">Lamination</SelectItem>
              <SelectItem value="OFFSET">Offset</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {finishType === "FABRIC" && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Fabric Type</Label>
            <Select value={selectedFabricTypeId} onValueChange={setSelectedFabricTypeId}>
              <SelectTrigger className="h-10 border-slate-200 text-xs font-mono">
                <SelectValue placeholder="Select fabric type" />
              </SelectTrigger>
              <SelectContent>
                {sortedFabricTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-xs font-mono">{t.fabric_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {finishType === "LAMINATION" && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Lamination Roll ID</Label>
            <Select value={selectedLamRollId} onValueChange={setSelectedLamRollId}>
              <SelectTrigger className="h-10 border-slate-200 text-xs font-mono">
                <SelectValue placeholder="Select lamination roll" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLaminationRolls.length === 0
                  ? <SelectItem value="_none" disabled>No available lamination rolls</SelectItem>
                  : uniqueLaminationRolls.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs font-mono">{r.roll_id}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {finishType === "OFFSET" && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Offset Roll ID</Label>
            <Select value={selectedOffsetRollId} onValueChange={setSelectedOffsetRollId}>
              <SelectTrigger className="h-10 border-slate-200 text-xs font-mono">
                <SelectValue placeholder="Select offset roll" />
              </SelectTrigger>
              <SelectContent>
                {uniqueOffsetRolls.length === 0
                  ? <SelectItem value="_none" disabled>No available offset rolls</SelectItem>
                  : uniqueOffsetRolls.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs font-mono">{r.roll_id}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="num_bags" className="text-xs font-semibold text-slate-700">Qty (Pieces / Bags)</Label>
          <Input id="num_bags" type="number" placeholder="0" value={numBags} onChange={(e) => setNumBags(e.target.value)} className="h-10 text-sm border-slate-200" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="weight_kg" className="text-xs font-semibold text-slate-700">Weight (KGs)</Label>
          <Input id="weight_kg" type="number" step="0.01" placeholder="0.00" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="h-10 text-sm border-slate-200" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entry_date" className="text-xs font-semibold text-slate-700">Entry Date</Label>
          <Input id="entry_date" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="h-10 text-sm border-slate-200" />
        </div>
      </div>

      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/40 flex flex-col gap-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Generated ID Preview</span>
        <Badge className="w-fit text-sm font-mono border border-amber-200 bg-amber-100/50 text-amber-900 py-1 px-2.5 rounded-md">
          {livePreviewId}
        </Badge>
      </div>

      <Button type="submit" className="w-fit px-6 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Production"}
      </Button>
    </form>
  );
}
