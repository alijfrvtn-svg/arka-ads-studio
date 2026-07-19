"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Building2,
  Newspaper,
  Image as ImageIcon,
  Users,
  MessageSquareQuote,
  Inbox,
  ListTodo,
  Home,
  Info,
  Mail,
  Users2,
  Shield,
  Settings,
  Search,
  Send,
  LogOut,
  ExternalLink,
  Menu,
  X,
  PanelRight,
  type LucideIcon,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationBell, type NotificationItem } from "@/components/notifications/NotificationBell";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  perm?: string;
}
const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "اصلی",
    items: [{ label: "داشبورد", href: "/admin", icon: LayoutDashboard, perm: "dashboard.view" }],
  },
  {
    group: "محتوا",
    items: [
      { label: "نمونه‌کارها", href: "/admin/portfolio", icon: FolderKanban, perm: "portfolio.view" },
      { label: "خدمات", href: "/admin/services", icon: Sparkles, perm: "services.manage" },
      { label: "صنایع", href: "/admin/industries", icon: Building2, perm: "industries.manage" },
      { label: "ژورنال", href: "/admin/journal", icon: Newspaper, perm: "blog.view" },
      { label: "کتابخانه رسانه", href: "/admin/media", icon: ImageIcon, perm: "media.manage" },
      { label: "صفحه اصلی", href: "/admin/home", icon: Home, perm: "home.manage" },
      { label: "درباره ما", href: "/admin/about", icon: Info, perm: "about.manage" },
      { label: "تماس", href: "/admin/contact", icon: Mail, perm: "contact.manage" },
      { label: "تیم", href: "/admin/team", icon: Users2, perm: "team.manage" },
    ],
  },
  {
    group: "روابط و فروش",
    items: [
      { label: "مشتریان (CRM)", href: "/admin/clients", icon: Users, perm: "clients.manage" },
      { label: "نظرات", href: "/admin/testimonials", icon: MessageSquareQuote, perm: "testimonials.manage" },
      { label: "سرنخ‌ها", href: "/admin/leads", icon: Inbox, perm: "leads.view" },
    ],
  },
  {
    group: "پرسنل",
    items: [
      { label: "تسک‌ها", href: "/admin/tasks", icon: ListTodo, perm: "tasks.view" },
      { label: "ارسال پیام", href: "/admin/notifications", icon: Send, perm: "users.manage" },
    ],
  },
  {
    group: "سیستم",
    items: [
      { label: "کاربران و نقش‌ها", href: "/admin/users", icon: Shield, perm: "users.manage" },
      { label: "تنظیمات", href: "/admin/settings", icon: Settings, perm: "settings.manage" },
    ],
  },
];

export function AdminShell({
  user,
  effective,
  notifications,
  children,
}: {
  user: { name: string; email: string; role: Role; avatar: string | null };
  effective: string[];
  notifications: NotificationItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const has = (p?: string) => !p || effective.includes("*") || effective.includes(p);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const roleLabel = ROLES.find((r) => r.value === user.role)?.label ?? user.role;

  const current = NAV.flatMap((g) => g.items)
    .filter((i) => isActive(i.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarInner = (
    <>
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/admin" className="flex items-center">
          <Logo />
        </Link>
        <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="بستن">
          <X className="h-5 w-5 text-foreground-muted" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {NAV.map((group) => {
          const items = group.items.filter((i) => has(i.perm));
          if (!items.length) return null;
          return (
            <div key={group.group}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-foreground-faint">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_var(--primary)]"
                          : "text-foreground-muted hover:bg-card-hover hover:text-foreground",
                      )}
                    >
                      <item.icon className={cn("h-[18px] w-[18px]", active ? "" : "text-foreground-faint group-hover:text-primary")} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-card-border p-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <img
            src={user.avatar || `https://i.pravatar.cc/80?u=${user.email}`}
            alt={user.name}
            className="h-10 w-10 rounded-full border border-card-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-foreground-faint">{roleLabel}</p>
          </div>
          <button
            onClick={logout}
            aria-label="خروج"
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background-2">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-l border-card-border bg-surface lg:flex">
        {SidebarInner}
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-card-border bg-surface">
            {SidebarInner}
          </aside>
        </div>
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-card-border bg-surface/80 px-4 backdrop-blur-xl md:px-6">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-card-border lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="منو"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <LogoMark className="h-7 w-7" />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <h1 className="font-display text-lg font-bold text-foreground">{current?.label ?? "پنل مدیریت"}</h1>
          </div>

          <div className="relative mx-auto hidden w-full max-w-md md:block">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
            <input
              placeholder="جستجو در پنل…"
              className="h-10 w-full rounded-xl border border-card-border bg-background/50 pr-10 pl-4 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-faint focus:border-primary"
            />
          </div>

          <div className="mr-auto flex items-center gap-1.5 md:mr-0">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg border border-card-border px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-primary hover:text-primary sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              مشاهده سایت
            </Link>
            <NotificationBell initial={notifications} />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
