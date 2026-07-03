"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  from: string;
  to: string;
  baseUrl: string;
}

export function DateRangeFilter({ from, to, baseUrl }: DateRangeFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFromChange = (newFrom: string) => {
    if (newFrom && newFrom.length === 10) {
      const separator = baseUrl.includes("?") ? "&" : "?";
      startTransition(() => {
        router.push(`${baseUrl}${separator}from=${newFrom}&to=${to}` as any);
      });
    }
  };

  const handleToChange = (newTo: string) => {
    if (newTo && newTo.length === 10) {
      const separator = baseUrl.includes("?") ? "&" : "?";
      startTransition(() => {
        router.push(`${baseUrl}${separator}from=${from}&to=${newTo}` as any);
      });
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm no-print transition-opacity", isPending && "opacity-60")}>
      <div className="flex items-center gap-2">
        <Label htmlFor="from-date" className="font-semibold text-sm shrink-0 text-slate-700 flex items-center gap-1">
          From:
          {isPending && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
        </Label>
        <Input
          id="from-date"
          type="date"
          defaultValue={from}
          disabled={isPending}
          onChange={(e) => handleFromChange(e.target.value)}
          className="w-40 h-8 text-sm cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="to-date" className="font-semibold text-sm shrink-0 text-slate-700">
          To:
        </Label>
        <Input
          id="to-date"
          type="date"
          defaultValue={to}
          disabled={isPending}
          onChange={(e) => handleToChange(e.target.value)}
          className="w-40 h-8 text-sm cursor-pointer"
        />
      </div>
    </div>
  );
}
