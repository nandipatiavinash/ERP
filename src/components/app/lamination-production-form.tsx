"use client";

import { useState, useTransition, useMemo } from "react";
import { saveLaminationProduction } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

type RawMaterial = {
  id: string;
  material_name: string;
};

interface LaminationProductionFormProps {
  fabricTypes: FabricType[];
  filmRolls: FilmRoll[];
  rawMaterials: RawMaterial[];
  onSuccess?: (newRollInfo: { rollId: string; weight: number; meters: number }) => void;
}

export function LaminationProductionForm({
  fabricTypes,
  filmRolls,
  rawMaterials,
  onSuccess,
}: LaminationProductionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [lamType, setLamType] = useState<string>("PLAIN");
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string>("");
  const [selectedFilmId, setSelectedFilmId] = useState<string>("");
  const [selectedRawMaterialId, setSelectedRawMaterialId] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [meters, setMeters] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute live preview of lamination roll_id
  const livePreviewId = useMemo(() => {
    const fabType = fabricTypes.find((t) => t.id === selectedFabricTypeId);
    const fabName = fabType ? fabType.fabric_name : "FABRIC-TYPE";

    const filmRoll = filmRolls.find((r) => r.id === selectedFilmId);
    const filmId = filmRoll ? filmRoll.roll_id : "FILM-ROLL";

    if (lamType === "BOX") {
      return `${filmId}(${fabName})(B)`;
    } else if (lamType === "F_S") {
      return `${filmId}(${fabName})(F/S)`;
    } else if (lamType === "H_S") {
      return `${filmId}(${fabName})(H/S)`;
    } else if (lamType === "NW") {
      return `(${fabName})(NW)`;
    } else if (lamType === "PLAIN") {
      return `(${fabName})(P)`;
    }
    return "";
  }, [lamType, selectedFabricTypeId, selectedFilmId, fabricTypes, filmRolls]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedFabricTypeId) {
      setErrorMsg("Fabric Type is required.");
      return;
    }
    if (["BOX", "F_S", "H_S"].includes(lamType) && !selectedFilmId) {
      setErrorMsg("Film Roll is required for BOX/FS/HS types.");
      return;
    }
    if (lamType === "NW" && !selectedRawMaterialId) {
      setErrorMsg("Non-Woven material is required for NW type.");
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
          fd.append("film_roll_id", selectedFilmId);
        }
        if (lamType === "NW") {
          fd.append("nw_material_id", selectedRawMaterialId);
        }
        fd.append("weight_kg", String(w));
        fd.append("meters", String(m));
        fd.append("entry_date", entryDate);

        await saveLaminationProduction(fd);
        setSuccessMsg(`Lamination roll created: ${livePreviewId}`);

        if (onSuccess) {
          onSuccess({ rollId: livePreviewId, weight: w, meters: m });
        }

        // Reset
        setSelectedFabricTypeId("");
        setSelectedFilmId("");
        setSelectedRawMaterialId("");
        setWeightKg("");
        setMeters("");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save.");
      }
    });
  };

  const isFilmRequired = ["BOX", "F_S", "H_S"].includes(lamType);
  const isNWRequired = lamType === "NW";

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

        {/* Lamination Type */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Lamination Type</Label>
          <Select value={lamType} onValueChange={(val) => { setLamType(val); setSelectedFabricTypeId(""); setSelectedFilmId(""); setSelectedRawMaterialId(""); }}>
            <SelectTrigger className="h-10 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PLAIN">PLAIN</SelectItem>
              <SelectItem value="BOX">BOX</SelectItem>
              <SelectItem value="F_S">F_S (Front & Back)</SelectItem>
              <SelectItem value="H_S">H_S (Half Lamination)</SelectItem>
              <SelectItem value="NW">NW (Non-Woven)</SelectItem>
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
              {fabricTypes.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  {t.fabric_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Film Roll (roto_metallic_rolls) */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">Select Film Roll (Roto Metallic)</Label>
          <Select
            value={selectedFilmId}
            onValueChange={setSelectedFilmId}
            disabled={!isFilmRequired}
          >
            <SelectTrigger className="h-10 border-slate-200 font-mono text-xs disabled:opacity-50">
              <SelectValue placeholder={isFilmRequired ? "Select metallic roll" : "Disabled"} />
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

        {/* Non-Woven Raw Material (only for NW type) */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">NW Raw Material (For NW Type)</Label>
          <Select
            value={selectedRawMaterialId}
            onValueChange={setSelectedRawMaterialId}
            disabled={!isNWRequired}
          >
            <SelectTrigger className="h-10 border-slate-200 disabled:opacity-50">
              <SelectValue placeholder={isNWRequired ? "Select NW raw mat" : "Disabled"} />
            </SelectTrigger>
            <SelectContent>
              {rawMaterials.map((rm) => (
                <SelectItem key={rm.id} value={rm.id}>{rm.material_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
        className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Production"}
      </Button>
    </form>
  );
}
