"use client";

import { useState, useTransition } from "react";
import { saveRotoFilmProduction } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type RotoProduct = {
  id: string;
  brand: string;
  customer_id: string | null;
};

type Customer = {
  id: string;
  customer_name: string;
  alias: string | null;
};

type RotoColor = {
  id: string;
  color_name: string;
};

interface RotoFilmProductionFormProps {
  rotoProducts: RotoProduct[];
  customers: Customer[];
  rotoColors: RotoColor[];
  onSuccess?: (newRollInfo: { rollId: string; weight: number; meters: number }) => void;
}

export function RotoFilmProductionForm({
  rotoProducts,
  customers,
  rotoColors,
  onSuccess,
}: RotoFilmProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedProductId, setSelectedProductId] = useState<string>("none");
  const [filmType, setFilmType] = useState<string>("gloss");
  const [selectedColorId, setSelectedColorId] = useState<string>("none");
  const [weightKg, setWeightKg] = useState<string>("");
  const [meters, setMeters] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute live preview of roll_id
  const livePreviewId = useMemo(() => {
    if (!selectedProductId || selectedProductId === "none") return "Select Brand...";
    const prod = rotoProducts.find((p) => p.id === selectedProductId);
    if (!prod) return "";
    const brandName = prod.brand;
    const cust = customers.find((c) => c.id === prod.customer_id);
    const alias = cust ? (cust.alias || cust.customer_name) : "";
    const filmTypeChar = filmType === "gloss" ? "G" : "M";

    let colorName = "";
    if (selectedColorId && selectedColorId !== "none") {
      const col = rotoColors.find((c) => c.id === selectedColorId);
      if (col) {
        colorName = col.color_name;
      }
    }

    let rollId = brandName;
    if (alias) {
      rollId += `(${alias})`;
    }
    rollId += `(${filmTypeChar})`;
    if (colorName) {
      rollId += `(${colorName})`;
    }
    return rollId;
  }, [selectedProductId, filmType, selectedColorId, rotoProducts, customers, rotoColors]);

  function useMemo<T>(factory: () => T, deps: any[]): T {
    // inline helper since this file runs on client react
    return factory();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedProductId || selectedProductId === "none") {
      setErrorMsg("Brand is required.");
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
        fd.append("brand_id", selectedProductId);
        fd.append("film_type", filmType);
        if (selectedColorId && selectedColorId !== "none") {
          fd.append("color_id", selectedColorId);
        }
        fd.append("weight_kg", String(w));
        fd.append("meters", String(m));
        fd.append("entry_date", entryDate);

        await saveRotoFilmProduction(fd);
        setSuccessMsg(`Roto Film roll created: ${livePreviewId}`);

        if (onSuccess) {
          onSuccess({ rollId: livePreviewId, weight: w, meters: m });
        }

        // Reset
        setSelectedProductId("none");
        setSelectedColorId("none");
        setWeightKg("");
        setMeters("");
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
        {/* Brand/Product */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Brand Name</Label>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              {rotoProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Film Type */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Film Type</Label>
          <Select value={filmType} onValueChange={setFilmType}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gloss">Gloss</SelectItem>
              <SelectItem value="matt">Matt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Colour</Label>
          <Select value={selectedColorId} onValueChange={setSelectedColorId}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (No color suffix)</SelectItem>
              {rotoColors.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.color_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KGs */}
        <div className="space-y-1">
          <Label htmlFor="weight_kg" className="text-xs font-semibold text-slate-700">KGs</Label>
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
          <Label htmlFor="meters" className="text-xs font-semibold text-slate-700">Mtrs</Label>
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
