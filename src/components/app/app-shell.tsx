"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { signOut } from "@/app/actions";
import { BrandLogo } from "@/components/app/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AppUser, RoleName } from "@/lib/database.types";
import { navGroups, type NavGroup } from "@/lib/navigation";

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/dashboard"
      onClick={onClick}
      className="flex h-16 items-center gap-3 border-b px-4 hover:bg-muted/40 transition-colors"
    >
      <BrandLogo className="h-10 w-10 shrink-0 rounded-full" />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">RK Global</div>
        <div className="truncate text-xs text-muted-foreground">Fabric ERP</div>
      </div>
    </Link>
  );
}

function NavLinks({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Auto-expand group containing active route on load/change
  useEffect(() => {
    const activeGroup = groups.find((g) => g.items.some((item) => pathname === item.href));
    if (activeGroup) {
      setExpanded({ [activeGroup.key]: true });
    }
  }, [pathname, groups]);

  const toggleGroup = (key: string) => {
    setExpanded((prev) => (prev[key] ? {} : { [key]: true }));
  };

  return (
    <nav className="space-y-1.5 p-3 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <Link
        href="/dashboard"
        prefetch={false}
        onPointerEnter={() => router.prefetch("/dashboard")}
        onFocus={() => router.prefetch("/dashboard")}
        onClick={onNavigate}
        className={cn(
          "flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          pathname === "/dashboard" && "bg-muted font-bold text-foreground"
        )}
      >
        Dashboard
      </Link>
      <div className="h-px bg-muted my-1.5" />
      {groups.map((group) => {
        const isExpanded = !!expanded[group.key];
        const hasActiveItem = group.items.some((item) => pathname === item.href);

        return (
          <div key={group.key} className="space-y-1">
            <button
              onClick={() => toggleGroup(group.key)}
              className={cn(
                "flex w-full min-h-10 items-center justify-between rounded-md px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                hasActiveItem && "text-foreground bg-muted/40"
              )}
            >
              <span>{group.label}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
              )}
            </button>

            {isExpanded && (
              <div className="space-y-0.5 pl-3 border-l ml-4 mt-1 border-muted">
                {group.items.map((item) => {
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
                        "flex min-h-9 items-center rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        active && "bg-muted font-medium text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

interface LowStockItem {
  name: string;
  stock: number;
  limit: number;
  unit: string;
}

export function AppShell({
  user,
  permissions,
  children,
  lowStockItems = [],
}: {
  user: AppUser & { roles: { name: RoleName } };
  permissions: string[];
  children: React.ReactNode;
  lowStockItems?: LowStockItem[];
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLowStockAlert, setShowLowStockAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    const handleSuccessAlert = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setSuccessAlert({
        isOpen: true,
        message: detail?.message || "Submitted successfully!",
      });
    };

    window.addEventListener("show-success-alert", handleSuccessAlert);
    return () => window.removeEventListener("show-success-alert", handleSuccessAlert);
  }, []);

  useEffect(() => {
    if (lowStockItems && lowStockItems.length > 0) {
      const shown = sessionStorage.getItem("lowStockAlertShown");
      if (!shown) {
        setShowLowStockAlert(true);
        sessionStorage.setItem("lowStockAlertShown", "true");
      }
    }
  }, [lowStockItems]);
  const groups = useMemo(() => {
    return navGroups
      .map((group) => {
        const items = group.items.filter(
          (item) => permissions.includes(item.permission) || item.roles.includes(user.roles.name)
        );
        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [permissions, user.roles.name]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement && target.type === "number") {
        if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
          e.preventDefault();
        }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement && target.type === "number") {
        const text = e.clipboardData?.getData("text");
        if (text && (Number(text) < 0 || isNaN(Number(text)))) {
          e.preventDefault();
        }
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement && target.type === "number") {
        if (Number(target.value) < 0) {
          target.value = "0";
        }
      }
    };

    const addMinAttribute = () => {
      document.querySelectorAll('input[type="number"]').forEach((el) => {
        if (!el.hasAttribute("min")) {
          el.setAttribute("min", "0");
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("paste", handlePaste, { capture: true });
    window.addEventListener("input", handleInput, { capture: true });

    addMinAttribute();
    const observer = new MutationObserver(addMinAttribute);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("paste", handlePaste, { capture: true });
      window.removeEventListener("input", handleInput, { capture: true });
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <RouteTransitionBar />
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-background lg:block">
        <Brand />
        <NavLinks groups={groups} />
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
                <Brand onClick={() => setMobileNavOpen(false)} />
                <NavLinks groups={groups} onNavigate={() => setMobileNavOpen(false)} />
              </DialogContent>
            </Dialog>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.full_name}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge>{user.roles.name}</Badge>
            <form
              action={signOut}
              onSubmit={() => {
                sessionStorage.removeItem("lowStockAlertShown");
              }}
            >
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </form>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {showLowStockAlert && pathname === "/dashboard" && (
        <div className="fixed top-4 right-4 z-[999] w-80 max-h-[420px] overflow-y-auto rounded-xl border border-red-200 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex gap-2.5">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-sm font-bold text-red-900">Low Stock Alert</h4>
                <p className="mt-0.5 text-xs text-red-700">
                  {lowStockItems.length} {lowStockItems.length === 1 ? "item is" : "items are"} below critical levels:
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLowStockAlert(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100"
              aria-label="Close alert"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 space-y-2 border-t pt-3 max-h-[200px] overflow-y-auto pr-1">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-slate-800">
                <span className="font-medium truncate max-w-[160px]" title={item.name}>{item.name}</span>
                <span className="font-mono text-red-600 font-semibold shrink-0">
                  {item.stock} {item.unit} <span className="text-slate-400 font-normal">/ {item.limit}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3.5 flex justify-end gap-2 border-t pt-3">
            <button
              onClick={() => setShowLowStockAlert(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 border rounded-md transition-all"
            >
              Dismiss
            </button>
            <Link
              href="/admin/critical-levels"
              onClick={() => setShowLowStockAlert(false)}
              className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 rounded-md shadow-sm transition-all"
            >
              View Inventory
            </Link>
          </div>
        </div>
      )}

      {successAlert.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[320px] rounded-xl border bg-white p-6 shadow-2xl scale-in-center animate-in zoom-in-95 duration-200 text-center flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100 shadow-inner">
              <svg className="h-10 w-10 text-emerald-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Success!</h3>
            <p className="mt-2 text-sm text-slate-600">{successAlert.message}</p>
            <button
              onClick={() => setSuccessAlert((prev) => ({ ...prev, isOpen: false }))}
              className="mt-5 w-full rounded-md bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow transition-all active:scale-[0.98]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RouteTransitionBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hide progress bar once the route/search parameters update completes
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        // Show progress bar for internal link transitions (in same window/tab)
        if (
          href &&
          href.startsWith("/") &&
          (!targetAttr || targetAttr === "_self")
        ) {
          const currentUrl = window.location.pathname + window.location.search;
          if (href !== currentUrl) {
            setLoading(true);
          }
        }
      }
    };

    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      const action = form.getAttribute("action");

      // Show loading bar for internal form-based queries (e.g., search/filter forms)
      if (!action || action.startsWith("/")) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-primary overflow-hidden">
      <div className="h-full bg-primary-foreground/30 animate-infinite-loading progress-bar-shine" />
      <style>{`
        @keyframes infinite-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-infinite-loading {
          animation: infinite-loading 1.2s infinite linear;
        }
        .progress-bar-shine {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }
      `}</style>
    </div>
  );
}

export function RouteTransitionBar() {
  return (
    <Suspense fallback={null}>
      <RouteTransitionBarInner />
    </Suspense>
  );
}
