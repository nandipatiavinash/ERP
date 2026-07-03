"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DateFilter({ date, baseUrl }: { date: string; baseUrl: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [val, setVal] = useState(date);

  useEffect(() => {
    setVal(date);
  }, [date]);

  const handleApply = () => {
    if (val && val.length === 10) {
      const separator = baseUrl.includes("?") ? "&" : "?";
      startTransition(() => {
        router.push(`${baseUrl}${separator}date=${val}` as any);
      });
    }
  };

  return (
    <div className={cn("flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm no-print transition-opacity", isPending && "opacity-60")}>
      <Label htmlFor="date-filter" className="font-semibold text-sm shrink-0 flex items-center gap-1.5">
        Filter by Date:
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
      </Label>
      <Input
        id="date-filter"
        type="date"
        value={val}
        disabled={isPending}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleApply();
          }
        }}
        className="w-44 h-8 text-sm cursor-pointer"
      />
      <Button
        size="sm"
        onClick={handleApply}
        disabled={isPending || val === date || val.length !== 10}
        className="h-8 px-3 text-xs"
      >
        Apply
      </Button>
    </div>
  );
}
