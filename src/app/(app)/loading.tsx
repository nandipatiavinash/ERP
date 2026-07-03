import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/15 backdrop-blur-[1px] transition-all duration-300">
      <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-700 tracking-wide animate-pulse">
          Loading ERP data...
        </span>
      </div>
    </div>
  );
}
