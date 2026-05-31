"use client";

import { useMemo, useState } from "react";
import { saveProduction } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Option = { id: string; label: string };

export function ProductionForm({
  fabrics,
  looms,
  lastMeters,
  isAdmin,
  row,
}: {
  fabrics: Option[];
  looms: Option[];
  lastMeters: Record<string, number>;
  isAdmin: boolean;
  row?: Record<string, any>;
}) {
  const defaultLoom = row?.loom_id ?? looms[0]?.id ?? "";
  const [loomId, setLoomId] = useState(defaultLoom);
  const [gross, setGross] = useState(Number(row?.gross_weight ?? 0));
  const [core, setCore] = useState(Number(row?.core_weight ?? 0));
  const [endMeters, setEndMeters] = useState(Number(row?.end_meters ?? 0));
  const initialMeters = Number(row?.initial_meters ?? lastMeters[loomId] ?? 0);
  const netWeight = Math.max(gross - core, 0);
  const netMeters = Math.max(endMeters - initialMeters, 0);
  const avg = netMeters > 0 ? (netWeight / netMeters) * 1000 : 0;

  const summary = useMemo(() => ({ netWeight, netMeters, avg }), [netWeight, netMeters, avg]);

  return (
    <form action={saveProduction} className="grid gap-4 md:grid-cols-3">
      {row?.id ? <input type="hidden" name="id" value={row.id} /> : null}
      <div className="space-y-2">
        <Label>Fabric Type</Label>
        <select name="fabric_type_id" defaultValue={row?.fabric_type_id ?? ""} required className="h-10 w-full rounded-md border bg-background px-3 text-sm">
          <option value="" disabled>Select fabric</option>
          {fabrics.map((fabric) => <option key={fabric.id} value={fabric.id}>{fabric.label}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Loom Number</Label>
        <select name="loom_id" value={loomId} onChange={(event) => setLoomId(event.target.value)} required className="h-10 w-full rounded-md border bg-background px-3 text-sm">
          <option value="" disabled>Select loom</option>
          {looms.map((loom) => <option key={loom.id} value={loom.id}>{loom.label}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Initial Meters</Label>
        <Input name="initial_meters" value={initialMeters} readOnly={!isAdmin} onChange={() => undefined} />
      </div>
      <div className="space-y-2">
        <Label>Gross Weight</Label>
        <Input name="gross_weight" type="number" step="0.001" defaultValue={row?.gross_weight ?? ""} required onChange={(event) => setGross(Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>Core Weight</Label>
        <Input name="core_weight" type="number" step="0.001" defaultValue={row?.core_weight ?? ""} required onChange={(event) => setCore(Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>End Meters</Label>
        <Input name="end_meters" type="number" step="0.01" defaultValue={row?.end_meters ?? ""} required onChange={(event) => setEndMeters(Number(event.target.value))} />
      </div>
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <div className="text-muted-foreground">Net Weight</div>
        <div className="font-semibold">{summary.netWeight.toFixed(3)} kg</div>
      </div>
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <div className="text-muted-foreground">Net Meters</div>
        <div className="font-semibold">{summary.netMeters.toFixed(2)} m</div>
      </div>
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <div className="text-muted-foreground">Average Meter Weight</div>
        <div className="font-semibold">{summary.avg.toFixed(3)}</div>
      </div>
      <div className="space-y-2 md:col-span-3">
        <Label>Remarks</Label>
        <Textarea name="remarks" defaultValue={row?.remarks ?? ""} />
      </div>
      <div className="md:col-span-3">
        <Button type="submit">{row?.id ? "Save Entry" : "Create Production Entry"}</Button>
      </div>
    </form>
  );
}
