"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [fromVal, setFromVal] = useState(from);
  const [toVal, setToVal] = useState(to);

  useEffect(() => {
    setFromVal(from);
    setToVal(to);
  }, [from, to]);

  const handleApply = () => {
    if (fromVal && fromVal.length === 10 && toVal && toVal.length === 10) {
      const separator = baseUrl.includes("?") ? "&" : "?";
      startTransition(() => {
        router.push(`${baseUrl}${separator}from=${fromVal}&to=${toVal}` as any);
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
          value={fromVal}
          disabled={isPending}
          onChange={(e) => setFromVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleApply();
            }
          }}
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
          value={toVal}
          disabled={isPending}
          onChange={(e) => setToVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleApply();
            }
          }}
          className="w-40 h-8 text-sm cursor-pointer"
        />
      </div>
      <Button
        size="sm"
        onClick={handleApply}
        disabled={isPending || (fromVal === from && toVal === to) || fromVal.length !== 10 || toVal.length !== 10}
        className="h-8 px-3 text-xs ml-auto"
      >
        Apply
      </Button>
    </div>
  );
}
