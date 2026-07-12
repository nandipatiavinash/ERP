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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {children}
    </div>
  );
}
