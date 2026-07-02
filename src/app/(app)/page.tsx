import { getSessionUser } from "@/lib/auth";
import { BrandLogo } from "@/components/app/brand-logo";

export default async function HomePage() {
  const user = await getSessionUser();
  const displayName = user?.full_name || "User";

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-8 text-center px-4">
      <div className="p-8 bg-white rounded-full shadow-lg border border-slate-100/80 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <BrandLogo className="h-44 w-44 rounded-full object-contain" />
      </div>
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 leading-none">
          Welcome <span className="text-emerald-600">{displayName}</span> to <span className="text-slate-900">RK Global</span>
        </h1>
      </div>
    </div>
  );
}
