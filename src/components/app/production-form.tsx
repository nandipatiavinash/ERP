"use client";

import { useMemo, useState } from "react";
import { saveProduction } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Option = { id: string; label: string };

export function ProductionForm({
  fabrics,
  looms,
  lastMeters,
  nextSerialByFabric,
  isAdmin,
  row,
}: {
  fabrics: Option[];
  looms: Option[];
  lastMeters: Record<string, number>;
  nextSerialByFabric: Record<string, number>;
  isAdmin: boolean;
  row?: Record<string, any>;
}) {
  const defaultFabric = row?.fabric_type_id ?? "";
  const defaultLoom = row?.loom_id ?? looms[0]?.id ?? "";
  const [fabricId, setFabricId] = useState(defaultFabric);
  const [loomId, setLoomId] = useState(defaultLoom);
  const [gross, setGross] = useState(Number(row?.gross_weight ?? 0));
  const [core, setCore] = useState(Number(row?.core_weight ?? 0));
  const [endMeters, setEndMeters] = useState(Number(row?.end_meters ?? 0));
  const [initialMetersInput, setInitialMetersInput] = useState(row?.initial_meters == null ? "" : String(row.initial_meters));
  const derivedInitialMeters = Number(lastMeters[loomId] ?? 0);
  const initialMetersValue = isAdmin ? (initialMetersInput || String(derivedInitialMeters)) : String(derivedInitialMeters);
  const initialMeters = Number(initialMetersValue);
  const netWeight = Math.max(gross - core, 0);
  const netMeters = Math.max(endMeters - initialMeters, 0);
  const avg = netMeters > 0 ? (netWeight / netMeters) * 1000 : 0;
  const nextSerial = row?.display_serial ?? (fabricId ? nextSerialByFabric[fabricId] ?? 1 : "-");

  const summary = useMemo(() => ({ netWeight, netMeters, avg }), [netWeight, netMeters, avg]);

  return (
    <form action={saveProduction} className="grid gap-4 md:grid-cols-3">
      {row?.id ? <input type="hidden" name="id" value={row.id} /> : null}
      <div className="space-y-2">
        <Label>Fabric ID</Label>
        <select name="fabric_type_id" value={fabricId} onChange={(event) => setFabricId(event.target.value)} required className="h-10 w-full rounded-md border bg-background px-3 text-sm">
          <option value="" disabled>Select fabric</option>
          {fabrics.map((fabric) => <option key={fabric.id} value={fabric.id}>{fabric.label}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Loom ID</Label>
        <select name="loom_id" value={loomId} onChange={(event) => setLoomId(event.target.value)} required className="h-10 w-full rounded-md border bg-background px-3 text-sm">
          <option value="" disabled>Select loom</option>
          {looms.map((loom) => <option key={loom.id} value={loom.id}>{loom.label}</option>)}
        </select>
      </div>
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm">
        <div className="text-emerald-700">{row?.id ? "Current S.No" : "Next S.No"}</div>
        <div className="text-xl font-bold text-emerald-950">{nextSerial}</div>
      </div>
      <div className="space-y-2">
        <Label>Initial Meters (m)</Label>
        <Input name="initial_meters" type="number" step="0.01" value={initialMetersValue} readOnly={!isAdmin} onChange={(event) => setInitialMetersInput(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Gross Weight (kg)</Label>
        <Input name="gross_weight" type="number" step="0.01" defaultValue={row?.gross_weight ?? ""} required onChange={(event) => setGross(Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>Core Weight (kg)</Label>
        <Input name="core_weight" type="number" step="0.01" defaultValue={row?.core_weight ?? ""} required onChange={(event) => setCore(Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>End Meters (m)</Label>
        <Input name="end_meters" type="number" step="0.01" defaultValue={row?.end_meters ?? ""} required onChange={(event) => setEndMeters(Number(event.target.value))} />
      </div>
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <div className="text-muted-foreground">Net Weight</div>
        <div className="font-semibold">{summary.netWeight.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg</div>
      </div>
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <div className="text-muted-foreground">Net Meters</div>
        <div className="font-semibold">{summary.netMeters.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m</div>
      </div>
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <div className="text-muted-foreground">Average Meter Weight</div>
        <div className="font-semibold">{summary.avg.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} g/m</div>
      </div>
      <div className="space-y-2 md:col-span-3">
        <Label>Remarks</Label>
        <Textarea name="remarks" defaultValue={row?.remarks ?? ""} />
      </div>
      <div className="md:col-span-3">
        <ConfirmSubmitButton confirmTitle={row?.id ? "Save production entry?" : "Create production entry?"} confirmDescription="Confirm the loom, fabric, weight, and meter readings before saving.">
          {row?.id ? "Save Entry" : "Create Production Entry"}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
