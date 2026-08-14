"use client";

import { useState } from "react";
import { showSuccess } from "@/lib/toast";
import { isRedirectError } from "@/lib/utils";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  saveTapeLineEntry,
  saveLoomShiftMeters,
  saveElectricityUnits,
  saveDailyWasteEntry
} from "@/app/(app)/_actions";

type LoomOption = { id: string; label: string };

// 1. Tape Line Form
export function TapeLineForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [tapeType, setTapeType] = useState("");
  const [loads, setLoads] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const loadsNum = Number(loads);
    if (isNaN(loadsNum) || loadsNum <= 0) {
      setErrorText("No. of Loads must be a positive number.");
      return;
    }
    setErrorText(null);

    setIsSaving(true);
    try {
      const formData = new FormData(event.currentTarget);
      await saveTapeLineEntry(formData);
      showSuccess("Tape Line entry submitted successfully!");
      setTapeType("");
      setLoads("");
    } catch (err: any) {
      if (isRedirectError(err)) throw err;
      setErrorText(err.message || "Failed to submit Tape Line entry.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorText && <div className="text-xs text-red-600 font-semibold">{errorText}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tape_type">Tape Line Type</Label>
          <Input
            id="tape_type"
            name="tape_type"
            value={tapeType}
            onChange={(e) => setTapeType(e.target.value)}
            placeholder="e.g. 50 GSM, Laminated Type"
            required
            disabled={isSaving}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="loads">No. of Loads</Label>
          <Input
            id="loads"
            name="loads"
            type="number"
            step="0.01"
            value={loads}
            onChange={(e) => setLoads(e.target.value)}
            placeholder="Enter Loads"
            required
            disabled={isSaving}
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <ConfirmSubmitButton
          type="submit"
          disabled={isSaving}
          confirmTitle="Submit Tape Line entry?"
          confirmDescription="This will record the Tape Line entry for today."
        >
          Submit
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}

// 2. Loom Shift Meters Form
export function LoomShiftMetersForm({ looms }: { looms: LoomOption[] }) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [loomId, setLoomId] = useState("");
  const [dayMeters, setDayMeters] = useState("");
  const [nightMeters, setNightMeters] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const dayNum = Number(dayMeters || 0);
    const nightNum = Number(nightMeters || 0);

    if (!loomId) {
      setErrorText("Loom ID is required.");
      return;
    }
    if (dayMeters === "" && nightMeters === "") {
      setErrorText("At least one shift's meters (Day or Night) must be entered.");
      return;
    }
    if (dayNum < 0 || nightNum < 0) {
      setErrorText("Meters cannot be negative.");
      return;
    }
    setErrorText(null);

    setIsSaving(true);
    try {
      const formData = new FormData(event.currentTarget);
      await saveLoomShiftMeters(formData);
      showSuccess("Loom shift meters submitted successfully!");
      setLoomId("");
      setDayMeters("");
      setNightMeters("");
    } catch (err: any) {
      if (isRedirectError(err)) throw err;
      setErrorText(err.message || "Failed to submit Loom shift meters.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorText && <div className="text-xs text-red-600 font-semibold">{errorText}</div>}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="loom_id">Loom ID</Label>
          <select
            id="loom_id"
            name="loom_id"
            value={loomId}
            onChange={(e) => setLoomId(e.target.value)}
            required
            disabled={isSaving}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select Loom</option>
            {looms.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="day_shift_meters">Day Shift (Mtrs)</Label>
          <Input
            id="day_shift_meters"
            name="day_shift_meters"
            type="number"
            step="0.01"
            value={dayMeters}
            onChange={(e) => setDayMeters(e.target.value)}
            placeholder="Enter Day Shift Meters"
            disabled={isSaving}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="night_shift_meters">Night Shift (Mtrs)</Label>
          <Input
            id="night_shift_meters"
            name="night_shift_meters"
            type="number"
            step="0.01"
            value={nightMeters}
            onChange={(e) => setNightMeters(e.target.value)}
            placeholder="Enter Night Shift Meters"
            disabled={isSaving}
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <ConfirmSubmitButton
          type="submit"
          disabled={isSaving}
          confirmTitle="Submit Loom Shift Meters?"
          confirmDescription="This will update shift meters for the selected Loom today."
        >
          Submit
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}

// 3. Electricity Units Form
export function ElectricityUnitsForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [units, setUnits] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const unitsNum = Number(units);
    if (isNaN(unitsNum) || unitsNum < 0) {
      setErrorText("Units must be a non-negative number.");
      return;
    }
    setErrorText(null);

    setIsSaving(true);
    try {
      const formData = new FormData(event.currentTarget);
      await saveElectricityUnits(formData);
      showSuccess("Electricity units submitted successfully!");
      setUnits("");
    } catch (err: any) {
      if (isRedirectError(err)) throw err;
      setErrorText(err.message || "Failed to submit electricity units.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorText && <div className="text-xs text-red-600 font-semibold">{errorText}</div>}
      <div className="space-y-1.5 max-w-sm">
        <Label htmlFor="units">Electricity Units</Label>
        <Input
          id="units"
          name="units"
          type="number"
          step="0.01"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          placeholder="Enter Electricity Units"
          required
          disabled={isSaving}
        />
      </div>
      <div className="flex justify-end pt-2">
        <ConfirmSubmitButton
          type="submit"
          disabled={isSaving}
          confirmTitle="Submit Electricity Units?"
          confirmDescription="This will update the electricity units consumed today."
        >
          Submit
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}

// 4. Daily Waste Form
export function DailyWasteForm({
  initialData
}: {
  initialData?: {
    plant_waste: number;
    bobon_waste: number;
    loom_waste: number;
    pipe_cutting_waste: number;
  } | null;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [plantWaste, setPlantWaste] = useState(initialData?.plant_waste?.toString() ?? "");
  const [bobonWaste, setBobonWaste] = useState(initialData?.bobon_waste?.toString() ?? "");
  const [loomWaste, setLoomWaste] = useState(initialData?.loom_waste?.toString() ?? "");
  const [pipeCuttingWaste, setPipeCuttingWaste] = useState(initialData?.pipe_cutting_waste?.toString() ?? "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const plantNum = Number(plantWaste || 0);
    const bobonNum = Number(bobonWaste || 0);
    const loomNum = Number(loomWaste || 0);
    const pipeCuttingNum = Number(pipeCuttingWaste || 0);

    if (plantNum < 0 || bobonNum < 0 || loomNum < 0 || pipeCuttingNum < 0) {
      setErrorText("Waste values must be non-negative.");
      return;
    }
    setErrorText(null);

    setIsSaving(true);
    try {
      const formData = new FormData(event.currentTarget);
      await saveDailyWasteEntry(formData);
      showSuccess("Daily waste entry submitted successfully!");
    } catch (err: any) {
      if (isRedirectError(err)) throw err;
      setErrorText(err.message || "Failed to submit daily waste entry.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorText && <div className="text-xs text-red-600 font-semibold">{errorText}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="plant_waste">Plant Waste (Kgs)</Label>
          <Input
            id="plant_waste"
            name="plant_waste"
            type="number"
            step="0.01"
            value={plantWaste}
            onChange={(e) => setPlantWaste(e.target.value)}
            placeholder="Enter Plant Waste"
            required
            disabled={isSaving}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bobon_waste">Bobon Waste (Kgs)</Label>
          <Input
            id="bobon_waste"
            name="bobon_waste"
            type="number"
            step="0.01"
            value={bobonWaste}
            onChange={(e) => setBobonWaste(e.target.value)}
            placeholder="Enter Bobon Waste"
            required
            disabled={isSaving}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="loom_waste">Loom Waste (Kgs)</Label>
          <Input
            id="loom_waste"
            name="loom_waste"
            type="number"
            step="0.01"
            value={loomWaste}
            onChange={(e) => setLoomWaste(e.target.value)}
            placeholder="Enter Loom Waste"
            required
            disabled={isSaving}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pipe_cutting_waste">Pipe Cutting Waste (Kgs)</Label>
          <Input
            id="pipe_cutting_waste"
            name="pipe_cutting_waste"
            type="number"
            step="0.01"
            value={pipeCuttingWaste}
            onChange={(e) => setPipeCuttingWaste(e.target.value)}
            placeholder="Enter Pipe Cutting Waste"
            required
            disabled={isSaving}
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <ConfirmSubmitButton
          type="submit"
          disabled={isSaving}
          confirmTitle="Submit Daily Waste?"
          confirmDescription="This will update today's daily waste entries."
        >
          Submit
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}

