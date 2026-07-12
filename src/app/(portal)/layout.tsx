import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // Must be logged in
  if (!user) redirect("/login");

  // Only clients (and admins previewing) can access the portal
  const role = user.roles?.name;
  if (role !== "client" && role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900/10 selection:text-slate-900 antialiased">
      {children}
    </div>
  );
}
