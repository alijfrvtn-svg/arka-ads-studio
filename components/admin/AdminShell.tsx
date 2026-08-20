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
  Send,
  Tags,
  Shapes,
  LogOut,
  ExternalLink,
  Palette,
  Type,
  MoreHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { AdminSearch } from "./AdminSearch";
import { NotificationBell, type NotificationItem } from "@/components/notifications/NotificationBell";
import { IdleLogout } from "@/components/auth/IdleLogout";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

/**
 * The panel's chrome, in the iOS 26 idiom.
 *
 * Two layouts, chosen by width because that is what actually changes — not by
 * pointer:
 *
 * - **From lg**, the iPad shape: a glass sidebar pinned to the inline start,
 *   holding grouped navigation with a tinted icon chip per row. That chip is
 *   the thing that makes a list of links read as a system app rather than as a
 *   web menu, and the tints are system colours, deliberately not the site's
 *   four brand colours — this is the tool, not the brand.
 *
 * - **Below lg**, the iPhone shape: a tab bar along the bottom carrying the
 *   four places you actually go, with everything else behind "more" in a
 *   sheet. A sidebar that slides over the content is a web pattern; a tab bar
 *   is what the system does, and it keeps its targets under the thumb.
 *
 * Everything the old shell did still happens — permissions filter the nav,
 * notifications, search, idle logout, theme, sign out. Only the surface changed.
 */

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  perm?: string;
  /** System colour for the icon chip. */
  tint: string;
}

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "مرور",
    items: [{ label: "داشبورد", href: "/admin", icon: LayoutDashboard, perm: "dashboard.view", tint: "var(--ios-blue)" }],
  },
  {
    group: "محتوای سایت",
    items: [
      { label: "نمونه‌کارها", href: "/admin/portfolio", icon: FolderKanban, perm: "portfolio.view", tint: "var(--ios-orange)" },
      { label: "خدمات", href: "/admin/services", icon: Sparkles, perm: "services.manage", tint: "var(--ios-purple)" },
      { label: "صنایع", href: "/admin/industries", icon: Building2, perm: "industries.manage", tint: "var(--ios-teal)" },
      { label: "ژورنال", href: "/admin/journal", icon: Newspaper, perm: "blog.view", tint: "var(--ios-pink)" },
      { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: Tags, perm: "blog.view", tint: "var(--ios-yellow)" },
      { label: "کتابخانه رسانه", href: "/admin/media", icon: ImageIcon, perm: "media.manage", tint: "var(--ios-green)" },
    ],
  },
  {
    group: "صفحات",
    items: [
      { label: "صفحه اصلی", href: "/admin/home", icon: Home, perm: "home.manage", tint: "var(--ios-blue)" },
      { label: "درباره ما", href: "/admin/about", icon: Info, perm: "about.manage", tint: "var(--ios-teal)" },
      { label: "تماس", href: "/admin/contact", icon: Mail, perm: "contact.manage", tint: "var(--ios-green)" },
      { label: "تیم", href: "/admin/team", icon: Users2, perm: "team.manage", tint: "var(--ios-orange)" },
    ],
  },
  {
    group: "ظاهر و متن سایت",
    items: [
      { label: "هویت بصری", href: "/admin/appearance", icon: Palette, perm: "settings.manage", tint: "var(--ios-pink)" },
      { label: "متن‌های سایت", href: "/admin/copy", icon: Type, perm: "settings.manage", tint: "var(--ios-purple)" },
    ],
  },
  {
    group: "ارتباط با مشتری",
    items: [
      { label: "مشتریان (CRM)", href: "/admin/clients", icon: Users, perm: "clients.manage", tint: "var(--ios-blue)" },
      { label: "نظرات", href: "/admin/testimonials", icon: MessageSquareQuote, perm: "testimonials.manage", tint: "var(--ios-yellow)" },
      { label: "سرنخ‌ها", href: "/admin/leads", icon: Inbox, perm: "leads.view", tint: "var(--ios-green)" },
    ],
  },
  {
    group: "تیم و کارها",
    items: [
      { label: "تسک‌ها", href: "/admin/tasks", icon: ListTodo, perm: "tasks.view", tint: "var(--ios-orange)" },
      { label: "ارسال پیام", href: "/admin/notifications", icon: Send, perm: "users.manage", tint: "var(--ios-teal)" },
    ],
  },
  {
    group: "سیستم",
    items: [
      { label: "کاربران و نقش‌ها", href: "/admin/users", icon: Shield, perm: "users.manage", tint: "var(--ios-red)" },
      { label: "راهنمای آیکن‌ها", href: "/admin/icons", icon: Shapes, perm: "dashboard.view", tint: "var(--ios-label-2)" },
      { label: "تنظیمات", href: "/admin/settings", icon: Settings, perm: "settings.manage", tint: "var(--ios-label-2)" },
    ],
  },
];

/** The four the tab bar carries. Everything else lives behind "more". */
const TABS = ["/admin", "/admin/portfolio", "/admin/journal", "/admin/leads"];

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
  const [moreOpen, setMoreOpen] = useState(false);

  const has = (p?: string) => !p || effective.includes("*") || effective.includes(p);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const roleLabel = ROLES.find((r) => r.value === user.role)?.label ?? user.role;

  const all = NAV.flatMap((g) => g.items).filter((i) => has(i.perm));
  // Longest match wins, so /admin/journal/new titles as ژورنال rather than as
  // the dashboard.
  const current = all.filter((i) => isActive(i.href)).sort((a, b) => b.href.length - a.href.length)[0];
  const tabs = TABS.map((h) => all.find((i) => i.href === h)).filter(Boolean) as NavItem[];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navGroups = NAV.map((g) => ({ ...g, items: g.items.filter((i) => has(i.perm)) })).filter((g) => g.items.length);

  return (
    <div data-ios dir="rtl" className="min-h-screen">
      <IdleLogout loginPath="/admin/login" />

      <div className="lg:flex">
        {/* ————— sidebar, from lg ————— */}
        <aside className="ios-sidebar sticky top-0 hidden h-screen w-[272px] flex-none flex-col lg:flex">
          <div className="flex h-16 flex-none items-center px-5">
            <Link href="/admin" aria-label="داشبورد">
              <Logo />
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-6">
            {navGroups.map((group) => (
              <div key={group.group} className="mb-5">
                <p className="ios-group-header">{group.group}</p>
                <div className="ios-group">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "ios-row ios-row-icon",
                        isActive(item.href) && "bg-[var(--ios-fill)] font-semibold",
                      )}
                    >
                      <span
                        className="grid h-[29px] w-[29px] flex-none place-items-center rounded-[7px] text-white"
                        style={{ background: item.tint }}
                      >
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="ios-body flex-1 truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="ios-group m-3 flex-none">
            <div className="ios-row ios-row-icon">
              <Avatar name={user.name} src={user.avatar} className="h-[29px] w-[29px] flex-none" />
              <span className="min-w-0 flex-1">
                <span className="ios-body block truncate">{user.name}</span>
                <span className="ios-caption block truncate text-[var(--ios-label-2)]">{roleLabel}</span>
              </span>
            </div>
            <button type="button" onClick={logout} className="ios-row ios-row-icon">
              <span className="grid h-[29px] w-[29px] flex-none place-items-center rounded-[7px] bg-[var(--ios-red)] text-white">
                <LogOut className="h-4 w-4" />
              </span>
              <span className="ios-body flex-1 text-[var(--ios-red)]">خروج</span>
            </button>
          </div>
        </aside>

        {/* ————— content ————— */}
        <div className="min-w-0 flex-1">
          {/* The nav bar names the section and carries the things that belong to
              the whole panel rather than to one page. */}
          <header className="ios-nav-bar flex h-14 items-center gap-2 px-4">
            <Link href="/admin" className="lg:hidden" aria-label="داشبورد">
              <Logo className="h-5" />
            </Link>
            <span className="ios-headline hidden truncate lg:block">{current?.label ?? "پنل مدیریت"}</span>
            <div className="mx-auto hidden w-full max-w-sm md:block">
              <AdminSearch />
            </div>
            <div className="ms-auto flex items-center gap-1 lg:ms-0">
              <NotificationBell initial={notifications} />
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                aria-label="دیدن سایت"
                className="grid h-11 w-11 place-items-center text-[var(--ios-label-2)]"
              >
                <ExternalLink className="h-[18px] w-[18px]" />
              </a>
            </div>
          </header>

          {/* pb-24 below lg so the tab bar never covers the last row. */}
          <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-4 lg:pb-16">{children}</main>
        </div>
      </div>

      {/* ————— tab bar, below lg ————— */}
      <nav className="ios-tabbar flex lg:hidden" aria-label="بخش‌های اصلی">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            aria-current={isActive(t.href) ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-0.5 py-2"
            style={{ color: isActive(t.href) ? "var(--ios-blue)" : "var(--ios-label-2)" }}
          >
            <t.icon className="h-[22px] w-[22px]" />
            <span className="ios-caption">{t.label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[var(--ios-label-2)]"
        >
          <MoreHorizontal className="h-[22px] w-[22px]" />
          <span className="ios-caption">بیشتر</span>
        </button>
      </nav>

      {/* ————— the "more" sheet ————— */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="ios-sheet absolute inset-x-0 bottom-0 max-h-[86svh] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
            <div className="ios-grabber" />
            <div className="flex items-center justify-between px-4 pb-2 pt-1">
              <span className="ios-title-3">همهٔ بخش‌ها</span>
              <button type="button" onClick={() => setMoreOpen(false)} className="grid h-11 w-11 place-items-center text-[var(--ios-label-2)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 pb-6">
              {navGroups.map((group) => (
                <div key={group.group} className="mb-5">
                  <p className="ios-group-header">{group.group}</p>
                  <div className="ios-group">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="ios-row ios-row-icon"
                      >
                        <span
                          className="grid h-[29px] w-[29px] flex-none place-items-center rounded-[7px] text-white"
                          style={{ background: item.tint }}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="ios-body flex-1 truncate">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="ios-group">
                <div className="ios-row ios-row-icon">
                  <Avatar name={user.name} src={user.avatar} className="h-[29px] w-[29px] flex-none" />
                  <span className="min-w-0 flex-1">
                    <span className="ios-body block truncate">{user.name}</span>
                    <span className="ios-caption block truncate text-[var(--ios-label-2)]">{roleLabel}</span>
                  </span>
                </div>
                <button type="button" onClick={logout} className="ios-row ios-row-icon">
                  <span className="grid h-[29px] w-[29px] flex-none place-items-center rounded-[7px] bg-[var(--ios-red)] text-white">
                    <LogOut className="h-4 w-4" />
                  </span>
                  <span className="ios-body flex-1 text-[var(--ios-red)]">خروج</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
