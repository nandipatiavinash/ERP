import { Loader2 } from "lucide-react";

export default function PageSkeleton({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-9 w-28 bg-slate-200 rounded-lg animate-pulse" />
      </div>
      {/* Card skeletons */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          <span className="text-sm text-slate-500 font-medium">{label}</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${30 + (i % 4) * 15}%` }} />
              <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${20 + (i % 3) * 10}%` }} />
              <div className="h-4 bg-slate-100 rounded animate-pulse ml-auto" style={{ width: "10%" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
