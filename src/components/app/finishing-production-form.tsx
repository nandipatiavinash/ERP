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

type RotoProduct = {
  id: string;
  brand: string;
};

type OffsetProduct = {
  id: string;
  brand: string;
};

interface FinishingProductionFormProps {
  fabricTypes: FabricType[];
  rotoProducts: RotoProduct[];
  offsetProducts: OffsetProduct[];
  onSuccess?: (newBundleInfo: { bundleId: string; numBags: number; weight: number }) => void;
  rows?: any[];
}

export function FinishingProductionForm({
  fabricTypes,
  rotoProducts,
  offsetProducts,
  onSuccess,
  rows,
}: FinishingProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [finishType, setFinishType] = useState<string>("");
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string>("");
  
  // Lamination sub-specifications
  const [laminationType, setLaminationType] = useState<string>("");
  const [selectedRotoProductId, setSelectedRotoProductId] = useState<string>("");

  // Offset sub-specifications
  const [offsetType, setOffsetType] = useState<string>("");
  const [selectedOffsetProductId, setSelectedOffsetProductId] = useState<string>("");

  const [numBags, setNumBags] = useState<string>("");
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

  const sortedRotoProducts = useMemo(() => {
    return [...rotoProducts].sort((a, b) => a.brand.localeCompare(b.brand));
  }, [rotoProducts]);

  const sortedOffsetProducts = useMemo(() => {
    return [...offsetProducts].sort((a, b) => a.brand.localeCompare(b.brand));
  }, [offsetProducts]);

  // Compute live preview of bundle_id prefix
  const livePreviewId = useMemo(() => {
    if (!finishType || !selectedFabricTypeId) return "SELECT-SPEC";

    const fab = fabricTypes.find((t) => t.id === selectedFabricTypeId);
    const fabricName = fab ? fab.fabric_name : "FABRIC-TYPE";

    if (finishType === "FABRIC") {
      return `PLAIN(${fabricName})()`;
    }

    if (finishType === "LAMINATION") {
      let brandName = "PLAIN";
      if (["BOX", "F_S", "H_S"].includes(laminationType)) {
        const p = rotoProducts.find((x) => x.id === selectedRotoProductId);
        brandName = p ? p.brand : "Select Brand";
      } else if (laminationType === "NW") {
        brandName = "NW";
      }

      let suffix = "";
      if (laminationType === "PLAIN") suffix = "p";
      else if (laminationType === "NW") suffix = "nw";
      else if (laminationType === "BOX") suffix = "b";
      else if (laminationType === "F_S") suffix = "f";
      else if (laminationType === "H_S") suffix = "h";

      return `${brandName}(${fabricName})(${suffix})()`;
    }

    if (finishType === "OFFSET") {
      const p = offsetProducts.find((x) => x.id === selectedOffsetProductId);
      const brandName = p ? p.brand : "Select Brand";
      return `${brandName}(${fabricName})()`;
    }

    return "SELECT-SPEC";
  }, [finishType, selectedFabricTypeId, laminationType, selectedRotoProductId, offsetType, selectedOffsetProductId, fabricTypes, rotoProducts, offsetProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!finishType) {
      setErrorMsg("Finishing Type is required.");
      return;
    }
    if (!selectedFabricTypeId) {
      setErrorMsg("Fabric Type is required.");
      return;
    }
    if (finishType === "LAMINATION") {
      if (!laminationType) {
        setErrorMsg("Lamination Type is required.");
        return;
      }
      if (["BOX", "F_S", "H_S"].includes(laminationType) && !selectedRotoProductId) {
        setErrorMsg("Laminated Brand is required.");
        return;
      }
    }
    if (finishType === "OFFSET") {
      if (!offsetType) {
        setErrorMsg("Offset Type is required.");
        return;
      }
      if (!selectedOffsetProductId) {
        setErrorMsg("Offset Brand is required.");
        return;
      }
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
        fd.append("fabric_type_id", selectedFabricTypeId);
        fd.append("num_bags", String(bags));
        fd.append("weight_kg", String(w));
        fd.append("entry_date", entryDate);

        if (finishType === "LAMINATION") {
          fd.append("lamination_type", laminationType);
          if (["BOX", "F_S", "H_S"].includes(laminationType)) {
            fd.append("roto_product_id", selectedRotoProductId);
          }
        } else if (finishType === "OFFSET") {
          fd.append("offset_type", offsetType);
          fd.append("offset_product_id", selectedOffsetProductId);
        }

        const res = await saveFinishingBundle(fd);
        showSuccess("Submitted successfully!");
        setSuccessMsg(`Finishing bundle created successfully: ${res?.bundle_id || livePreviewId}`);

        if (onSuccess) {
          onSuccess({ bundleId: res?.bundle_id || livePreviewId, numBags: bags, weight: w });
        }

        // Reset
        setFinishType("");
        setSelectedFabricTypeId("");
        setLaminationType("");
        setSelectedRotoProductId("");
        setOffsetType("");
        setSelectedOffsetProductId("");
        setNumBags("");
        setWeightKg("");
      } catch (err: any) {
        if (isRedirectError(err)) throw err;
        setErrorMsg(err.message || "Failed to save.");
      }
    });
  };

  const isLamBrandRequired = ["BOX", "F_S", "H_S"].includes(laminationType);

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
          <Select value={finishType} onValueChange={(val) => { setFinishType(val); setSelectedFabricTypeId(""); setLaminationType(""); setSelectedRotoProductId(""); setOffsetType(""); setSelectedOffsetProductId(""); }}>
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

        {/* Fabric Type dropdown */}
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

        {/* Lamination fields */}
        {finishType === "LAMINATION" && (
          <>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Lamination Type</Label>
              <Select value={laminationType} onValueChange={(val) => { setLaminationType(val); setSelectedRotoProductId(""); }}>
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

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Laminated Brand</Label>
              <Select
                value={selectedRotoProductId}
                onValueChange={setSelectedRotoProductId}
                disabled={!isLamBrandRequired}
              >
                <SelectTrigger className="h-10 border-slate-200 text-xs disabled:opacity-50">
                  <SelectValue placeholder={isLamBrandRequired ? "Select brand" : "No brand required"} />
                </SelectTrigger>
                <SelectContent>
                  {sortedRotoProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Offset fields */}
        {finishType === "OFFSET" && (
          <>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Offset Type</Label>
              <Select value={offsetType} onValueChange={setOffsetType}>
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue placeholder="Select offset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FABRIC">Fabric</SelectItem>
                  <SelectItem value="NW">NW</SelectItem>
                  <SelectItem value="NW_LAM">NW_LAM</SelectItem>
                  <SelectItem value="PLAIN_LAM">PLAIN_LAM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Offset Brand</Label>
              <Select value={selectedOffsetProductId} onValueChange={setSelectedOffsetProductId}>
                <SelectTrigger className="h-10 border-slate-200 text-xs">
                  <SelectValue placeholder="Select offset brand" />
                </SelectTrigger>
                <SelectContent>
                  {sortedOffsetProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
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

      {/* Live Preview Bundle ID */}
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
