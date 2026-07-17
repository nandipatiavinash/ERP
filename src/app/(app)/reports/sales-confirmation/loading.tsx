import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-slate-200" />
        <Skeleton className="h-4 w-96 bg-slate-100" />
      </div>

      {/* Tabs and filters skeleton */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-4">
          <Skeleton className="h-9 w-40 bg-slate-200" />
          <Skeleton className="h-9 w-40 bg-slate-100" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-44 bg-slate-100" />
          <Skeleton className="h-9 w-64 bg-slate-100" />
        </div>
      </div>

      {/* Content list skeletons */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-5 bg-white space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-56 bg-slate-200" />
                <Skeleton className="h-3.5 w-40 bg-slate-100" />
              </div>
              <div className="flex gap-8">
                <Skeleton className="h-8 w-16 bg-slate-100" />
                <Skeleton className="h-8 w-24 bg-slate-100" />
                <Skeleton className="h-8 w-20 bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
