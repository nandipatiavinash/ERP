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

type LaminationRoll = {
  id: string;
  roll_id: string;
  weight_kg: number;
};

type FabricRoll = {
  id: string;
  roll_number: string;
  weight: number;
  fabric_types: {
    fabric_name: string;
  } | null;
};

type OffsetRoll = {
  id: string;
  roll_id: string;
  weight_kg: number;
};

type FinishingProduct = {
  id: string;
  name: string;
};

interface FinishingProductionFormProps {
  laminationRolls: LaminationRoll[];
  fabricRolls: FabricRoll[];
  offsetRolls: OffsetRoll[];
  finishingProducts: FinishingProduct[];
  onSuccess?: (newBundleInfo: { bundleId: string; numBags: number; weight: number }) => void;
  rows?: any[];
}

export function FinishingProductionForm({
  laminationRolls,
  fabricRolls,
  offsetRolls,
  finishingProducts,
  onSuccess,
  rows,
}: FinishingProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [finishType, setFinishType] = useState<string>("FABRIC");
  const [selectedLamId, setSelectedLamId] = useState<string>("none");
  const [selectedFabricRollId, setSelectedFabricRollId] = useState<string>("none");
  const [selectedOffsetRollId, setSelectedOffsetRollId] = useState<string>("none");
  const [selectedProductId, setSelectedProductId] = useState<string>("none");
  const [numBags, setNumBags] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const parentId = useMemo(() => {
    if (finishType === "LAMINATION") {
      const lam = laminationRolls.find((r) => r.id === selectedLamId);
      return lam ? lam.roll_id : "";
    } else if (finishType === "FABRIC") {
      const fr = fabricRolls.find((r) => r.id === selectedFabricRollId);
      if (fr) {
        const typeName = fr.fabric_types?.fabric_name || "PLAIN";
        return `PLAIN(${typeName})(${fr.roll_number})`;
      }
      return "";
    } else if (finishType === "OFFSET") {
      const off = offsetRolls.find((r) => r.id === selectedOffsetRollId);
      return off ? off.roll_id : "";
    }
    return "";
  }, [finishType, selectedLamId, selectedFabricRollId, selectedOffsetRollId, laminationRolls, fabricRolls, offsetRolls]);

  const livePreviewId = useMemo(() => {
    return parentId ? `${parentId}()` : "SELECT-ROLL";
  }, [parentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedProductId || selectedProductId === "none") {
      setErrorMsg("Finished Bag specification is required.");
      return;
    }
    if (finishType === "LAMINATION" && (!selectedLamId || selectedLamId === "none")) {
      setErrorMsg("Lamination Roll is required.");
      return;
    }
    if (finishType === "FABRIC" && (!selectedFabricRollId || selectedFabricRollId === "none")) {
      setErrorMsg("Fabric Roll is required.");
      return;
    }
    if (finishType === "OFFSET" && (!selectedOffsetRollId || selectedOffsetRollId === "none")) {
      setErrorMsg("Offset Roll is required.");
      return;
    }
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
        fd.append("product_id", selectedProductId);
        if (finishType === "LAMINATION") {
          fd.append("source_lam_roll_id", selectedLamId);
        } else if (finishType === "FABRIC") {
          fd.append("source_fabric_roll_id", selectedFabricRollId);
        } else if (finishType === "OFFSET") {
          fd.append("source_offset_roll_id", selectedOffsetRollId);
        }
        fd.append("num_bags", String(bags));
        fd.append("weight_kg", String(w));
        fd.append("entry_date", entryDate);

        const res = await saveFinishingBundle(fd);
        showSuccess("Submitted successfully!");
        setSuccessMsg(`Finishing bundle created successfully: ${res?.bundle_id || livePreviewId}`);

        if (onSuccess) {
          onSuccess({ bundleId: res?.bundle_id || livePreviewId, numBags: bags, weight: w });
        }

        // Reset
        setSelectedLamId("none");
        setSelectedFabricRollId("none");
        setSelectedOffsetRollId("none");
        setSelectedProductId("none");
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
        {/* Finished Bag Spec Dropdown */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Finished Bag Product</Label>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="Select bag type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" disabled>Select bag type</SelectItem>
              {finishingProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Finishing Type Select */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Finishing Type</Label>
          <Select value={finishType} onValueChange={(val) => { setFinishType(val); setSelectedLamId("none"); setSelectedFabricRollId("none"); setSelectedOffsetRollId("none"); }}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="Select finishing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FABRIC">Fabric</SelectItem>
              <SelectItem value="LAMINATION">Lamination</SelectItem>
              <SelectItem value="OFFSET">Offset</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Source Selection based on Finishing Type */}
        {finishType === "LAMINATION" && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Select Lamination Roll</Label>
            <Select value={selectedLamId} onValueChange={setSelectedLamId}>
              <SelectTrigger className="h-10 border-slate-200 font-mono text-xs">
                <SelectValue placeholder="Select lamination roll" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>Select lamination roll</SelectItem>
                {laminationRolls.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="font-mono text-xs">
                    {r.roll_id} ({r.weight_kg}kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {finishType === "FABRIC" && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Select Fabric Roll</Label>
            <Select value={selectedFabricRollId} onValueChange={setSelectedFabricRollId}>
              <SelectTrigger className="h-10 border-slate-200 font-mono text-xs">
                <SelectValue placeholder="Select fabric roll" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>Select fabric roll</SelectItem>
                {fabricRolls.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="font-mono text-xs">
                    Roll #{r.roll_number} ({r.fabric_types?.fabric_name} · {r.weight}kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {finishType === "OFFSET" && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Select Offset Roll</Label>
            <Select value={selectedOffsetRollId} onValueChange={setSelectedOffsetRollId}>
              <SelectTrigger className="h-10 border-slate-200 font-mono text-xs">
                <SelectValue placeholder="Select offset roll" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>Select offset roll</SelectItem>
                {offsetRolls.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="font-mono text-xs">
                    {r.roll_id} ({r.weight_kg}kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
