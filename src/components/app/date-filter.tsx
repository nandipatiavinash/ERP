"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DateFilter({ date, baseUrl }: { date: string; baseUrl: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn("flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm no-print transition-opacity", isPending && "opacity-60")}>
      <Label htmlFor="date-filter" className="font-semibold text-sm shrink-0 flex items-center gap-1.5">
        Filter by Date:
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
      </Label>
      <Input
        id="date-filter"
        type="date"
        defaultValue={date}
        disabled={isPending}
        onChange={(e) => {
          const newDate = e.target.value;
          // Only trigger navigation if the date is fully completed (YYYY-MM-DD has 10 characters)
          if (newDate && newDate.length === 10) {
            const separator = baseUrl.includes("?") ? "&" : "?";
            startTransition(() => {
              router.push(`${baseUrl}${separator}date=${newDate}` as any);
            });
          }
        }}
        className="w-44 h-8 text-sm cursor-pointer"
      />
    </div>
  );
}
