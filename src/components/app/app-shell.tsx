"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Factory, LogOut, Menu } from "lucide-react";
import { signOut } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AppUser, RoleName } from "@/lib/database.types";
import type { NavItem } from "@/lib/navigation";

function Brand() {
  return (
    <div className="flex h-16 items-center gap-2 border-b px-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Factory className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold">Polymer ERP</div>
        <div className="text-xs text-muted-foreground">Fabric manufacturing</div>
      </div>
    </div>
  );
}

function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1 p-3">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href as any}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
              active && "bg-muted font-medium text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  user,
  items,
  children,
}: {
  user: AppUser & { roles: { name: RoleName } };
  items: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-background lg:block">
        <Brand />
        <NavLinks items={items} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b bg-background px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="outline" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="left-0 top-0 h-full w-80 max-w-[85vw] translate-x-0 translate-y-0 rounded-none p-0">
                <DialogTitle className="sr-only">Navigation</DialogTitle>
                <Brand />
                <NavLinks items={items} />
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
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </form>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
