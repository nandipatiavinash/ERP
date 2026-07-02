"use client";

import { useState, useTransition } from "react";
import { showSuccess } from "@/lib/toast";
import { saveRotoMetallicProduction } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { isRedirectError } from "@/lib/utils";

type FilmRoll = {
  id: string;
  roll_id: string;
  weight_kg: number;
  meters: number;
};

interface RotoMetallicProductionFormProps {
  filmRolls: FilmRoll[];
  onSuccess?: (newRollInfo: { rollId: string; weight: number; meters: number }) => void;
  rows?: any[];
}

export function RotoMetallicProductionForm({
  filmRolls,
  onSuccess,
  rows,
}: RotoMetallicProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFilmId, setSelectedFilmId] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [meters, setMeters] = useState<string>("");
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute live preview of metallic roll_id
  const livePreviewId = useMemo(() => {
    if (!selectedFilmId) return "Select Printed Film...";
    const roll = filmRolls.find((f) => f.id === selectedFilmId);
    if (!roll) return "";
    return `${roll.roll_id}(Mt)`;
  }, [selectedFilmId, filmRolls]);

  function useMemo<T>(factory: () => T, deps: any[]): T {
    return factory();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedFilmId) {
      setErrorMsg("Printed Film is required.");
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
        fd.append("source_film_roll_id", selectedFilmId);
        fd.append("is_split", isSplit ? "1" : "0");
        fd.append("weight_kg", String(w));
        fd.append("meters", String(m));
        fd.append("entry_date", entryDate);

        await saveRotoMetallicProduction(fd);
        showSuccess("Submitted successfully!");
        setSuccessMsg(`Roto Metallic roll created: ${livePreviewId}`);

        if (onSuccess) {
          onSuccess({ rollId: livePreviewId, weight: w, meters: m });
        }

        // Reset
        setSelectedFilmId("");
        setWeightKg("");
        setMeters("");
        setIsSplit(false);
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
        {/* Printed Film Selector */}
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs font-semibold text-slate-700">Select Printed Film Roll</Label>
          <Select value={selectedFilmId} onValueChange={setSelectedFilmId}>
            <SelectTrigger className="h-10 border-slate-200 font-mono text-xs">
              <SelectValue placeholder="Select film roll from stock" />
            </SelectTrigger>
            <SelectContent>
              {filmRolls.map((f) => (
                <SelectItem key={f.id} value={f.id} className="font-mono text-xs">
                  {f.roll_id} ({f.weight_kg}kg · {f.meters}m)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KGs */}
        <div className="space-y-1">
          <Label htmlFor="weight_kg" className="text-xs font-semibold text-slate-700">Metallic Roll KGs</Label>
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
          <Label htmlFor="meters" className="text-xs font-semibold text-slate-700">Metallic Roll Mtrs</Label>
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

        {/* Checkbox for Split Roll */}
        <div className="md:col-span-3 flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <input
            id="is_split"
            type="checkbox"
            checked={isSplit}
            onChange={(e) => setIsSplit(e.target.checked)}
            className="h-4 w-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <div className="text-xs">
            <Label htmlFor="is_split" className="font-semibold text-slate-800 cursor-pointer select-none">
              Keep source film roll in stock (Split Roll)
            </Label>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Check this if you are split-winding and want this printed film roll to remain in stock. Unchecking consumes it.
            </p>
          </div>
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
