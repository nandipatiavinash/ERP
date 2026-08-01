"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
      href="/"
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
        prefetch={true}
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
                      prefetch={true}
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
        if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E" || e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
        }
      }
    };

    const validateNumberInput = (el: HTMLInputElement, forceShow = false) => {
      el.classList.remove("border-destructive", "ring-destructive", "ring-1", "bg-red-50/50");
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement && target.type === "number") {
        const text = e.clipboardData?.getData("text");
        if (text) {
          const val = Number(text);
          if (isNaN(val) || val <= 0) {
            e.preventDefault();
          }
        }
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement && target.type === "number") {
        target.dataset.touched = "true";
        validateNumberInput(target);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement && target.type === "number") {
        target.blur();
      }
    };

    const addMinAttributeAndValidate = () => {
      document.querySelectorAll('input[type="number"]').forEach((el) => {
        if (el instanceof HTMLInputElement) {
          validateNumberInput(el);
        }
      });
    };

    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      let firstInvalid: HTMLInputElement | null = null;
      form.querySelectorAll('input[type="number"]').forEach((el) => {
        if (el instanceof HTMLInputElement) {
          validateNumberInput(el, true);
          const val = Number(el.value);
          if (el.value === "" && !el.required) return;
          if (el.value === "" || isNaN(val) || val <= 0) {
            if (!firstInvalid) firstInvalid = el;
          }
        }
      });
      if (firstInvalid) {
        e.preventDefault();
        e.stopPropagation();
        (firstInvalid as HTMLInputElement).focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("paste", handlePaste, { capture: true });
    window.addEventListener("input", handleInput, { capture: true });
    window.addEventListener("submit", handleSubmit, { capture: true });
    window.addEventListener("wheel", handleWheel, { capture: true, passive: true });

    addMinAttributeAndValidate();
    const observer = new MutationObserver(addMinAttributeAndValidate);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("paste", handlePaste, { capture: true });
      window.removeEventListener("input", handleInput, { capture: true });
      window.removeEventListener("submit", handleSubmit, { capture: true });
      window.removeEventListener("wheel", handleWheel, { capture: true });
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
              <div className="truncate text-sm font-semibold text-emerald-950">Welcome, {user.full_name}! 👋</div>
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
