import { getSessionUser } from "@/lib/auth";
import { BrandLogo } from "@/components/app/brand-logo";

export default async function HomePage() {
  const user = await getSessionUser();
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-6 text-center">
      <div className="p-8 bg-white rounded-full shadow-lg border border-slate-100/80 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <BrandLogo className="h-44 w-44 rounded-full object-contain" />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          Welcome to RK Global ERP
        </h1>
        <p className="text-slate-500 text-lg sm:text-xl">
          Logged in as <span className="font-semibold text-emerald-700">{user?.full_name}</span>
        </p>
      </div>
    </div>
  );
}
