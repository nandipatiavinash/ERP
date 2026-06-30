"use client";

import { useState, useTransition, useMemo } from "react";
import { saveFinishingBundle } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type LaminationRoll = {
  id: string;
  roll_id: string;
  weight_kg: number;
};

type FabricType = {
  id: string;
  fabric_name: string;
};

interface FinishingProductionFormProps {
  laminationRolls: LaminationRoll[];
  fabricTypes: FabricType[];
  onSuccess?: (newBundleInfo: { bundleId: string; numBags: number; weight: number }) => void;
  rows?: any[];
}

export function FinishingProductionForm({
  laminationRolls,
  fabricTypes,
  onSuccess,
  rows,
}: FinishingProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [finishType, setFinishType] = useState<string>("PLAIN");
  const [selectedLamId, setSelectedLamId] = useState<string>("none");
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string>("none");
  const [numBags, setNumBags] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const livePreviewId = useMemo(() => {
    let brandName = "PLAIN";
    let fabricName = "FABRIC-TYPE";
    if (finishType === "LAMINATED") {
      const lam = laminationRolls.find((r) => r.id === selectedLamId);
      if (lam) {
        const match = lam.roll_id.match(/^([^(]+)\(([^)]+)\)/);
        if (match) {
          brandName = match[1].trim();
          fabricName = match[2];
        } else {
          brandName = lam.roll_id;
          fabricName = "LAMINATED";
        }
      }
    } else if (finishType === "PLAIN") {
      const ft = fabricTypes.find((t) => t.id === selectedFabricTypeId);
      if (ft) fabricName = ft.fabric_name;
    } else if (finishType === "NW") {
      brandName = "NW";
      fabricName = "NW";
    }
    return `${brandName}(${fabricName})()`;
  }, [finishType, selectedLamId, selectedFabricTypeId, laminationRolls, fabricTypes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (finishType === "LAMINATED" && (!selectedLamId || selectedLamId === "none")) {
      setErrorMsg("Lamination Roll is required.");
      return;
    }
    if (finishType === "PLAIN" && (!selectedFabricTypeId || selectedFabricTypeId === "none")) {
      setErrorMsg("Fabric Type is required.");
      return;
    }
    const bags = parseInt(numBags, 10);
    const w = parseFloat(weightKg);
    if (!bags || bags <= 0 || !w || w <= 0) {
      setErrorMsg("Number of Bags and KGs must be positive.");
      return;
    }

    // Client-side duplicate check
    if (rows) {
      const isDup = rows.some((r: any) =>
        r.finish_type === finishType &&
        (finishType === "LAMINATED" ? r.source_lam_roll_id === selectedLamId : true) &&
        (finishType === "PLAIN" ? r.fabric_type_id === selectedFabricTypeId : true) &&
        Math.floor(Number(r.num_bags)) === Math.floor(bags) &&
        Math.floor(Number(r.weight_kg) * 100) === Math.floor(w * 100)
      );
      if (isDup) {
        const ok = window.confirm("This entry appears to be a duplicate (an identical entry already exists for today). Do you still want to submit?");
        if (!ok) return;
      }
    }

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("finish_type", finishType);
        if (finishType === "LAMINATED") {
          fd.append("source_lam_roll_id", selectedLamId);
        } else if (finishType === "PLAIN") {
          fd.append("fabric_type_id", selectedFabricTypeId);
        }
        fd.append("num_bags", String(bags));
        fd.append("weight_kg", String(w));
        fd.append("entry_date", entryDate);

        await saveFinishingBundle(fd);
        alert("Submitted successfully!");
        setSuccessMsg(`Finishing bundle created successfully: ${livePreviewId}`);

        if (onSuccess) {
          onSuccess({ bundleId: livePreviewId, numBags: bags, weight: w });
        }

        // Reset
        setSelectedLamId("none");
        setSelectedFabricTypeId("none");
        setNumBags("");
        setWeightKg("");
      } catch (err: any) {
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
        {/* Finishing Type Select */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Finishing Type</Label>
          <Select value={finishType} onValueChange={(val) => { setFinishType(val); setSelectedLamId("none"); setSelectedFabricTypeId("none"); }}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="Select finishing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PLAIN">PLAIN</SelectItem>
              <SelectItem value="LAMINATED">LAMINATED</SelectItem>
              <SelectItem value="NW">NW</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Source Selection based on Finishing Type */}
        {finishType === "LAMINATED" && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Select Laminated Roll</Label>
            <Select value={selectedLamId} onValueChange={setSelectedLamId}>
              <SelectTrigger className="h-10 border-slate-200 font-mono text-xs">
                <SelectValue placeholder="Select lamination roll" />
              </SelectTrigger>
              <SelectContent>
                {laminationRolls.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="font-mono text-xs">
                    {r.roll_id} ({r.weight_kg}kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {finishType === "PLAIN" && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Select Fabric Type</Label>
            <Select value={selectedFabricTypeId} onValueChange={setSelectedFabricTypeId}>
              <SelectTrigger className="h-10 border-slate-200 text-xs">
                <SelectValue placeholder="Select fabric type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>Select fabric type</SelectItem>
                {fabricTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-xs">
                    {t.fabric_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* No. of Bags */}
        <div className="space-y-1">
          <Label htmlFor="num_bags" className="text-xs font-semibold text-slate-700">No. of Bags</Label>
          <Input
            id="num_bags"
            type="number"
            placeholder="0"
            value={numBags}
            onChange={(e) => setNumBags(e.target.value)}
            className="h-10 text-sm border-slate-200"
          />
        </div>

        {/* KGs */}
        <div className="space-y-1">
          <Label htmlFor="weight_kg" className="text-xs font-semibold text-slate-700">Weight (KGs)</Label>
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
