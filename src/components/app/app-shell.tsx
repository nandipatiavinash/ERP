"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { signOut } from "@/app/actions";
import { BrandLogo } from "@/components/app/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AppUser, RoleName } from "@/lib/database.types";
import { navItems, type NavItem } from "@/lib/navigation";

function Brand() {
  return (
    <div className="flex h-16 items-center gap-3 border-b px-4">
      <BrandLogo className="h-10 w-10 shrink-0 rounded-full" />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">RK Global</div>
        <div className="truncate text-xs text-muted-foreground">Fabric ERP</div>
      </div>
    </div>
  );
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <nav className="space-y-1 p-3">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href as any}
            prefetch={false}
            onPointerEnter={() => router.prefetch(item.href as any)}
            onFocus={() => router.prefetch(item.href as any)}
            onClick={onNavigate}
            className={cn(
              "flex min-h-10 items-center rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-muted font-medium text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  user,
  permissions,
  children,
}: {
  user: AppUser & { roles: { name: RoleName } };
  permissions: string[];
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide();
      } catch (e) {
        // Ignored when running in standard browser env
      }
    };
    hideSplash();
  }, []);

  const items = useMemo(
    () => navItems.filter((item) => permissions.includes(item.permission) || item.roles.includes(user.roles.name)),
    [permissions, user.roles.name],
  );
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-background lg:block">
        <Brand />
        <NavLinks items={items} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b bg-background px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="outline" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="left-0 top-0 h-full w-[min(20rem,88vw)] translate-x-0 translate-y-0 overflow-y-auto rounded-none p-0">
                <DialogTitle className="sr-only">Navigation</DialogTitle>
                <Brand />
                <NavLinks items={items} onNavigate={() => setMobileNavOpen(false)} />
              </DialogContent>
            </Dialog>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.full_name}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge>{user.roles.name}</Badge>
            <form action={signOut}>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </form>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
