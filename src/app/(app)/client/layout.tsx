import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  
  // Only allow "client" or "admin" to access client portal pages
  if (user.roles?.name !== "client" && user.roles?.name !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
