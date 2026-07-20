"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ListTodo, CalendarDays } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationBell, type NotificationItem } from "@/components/notifications/NotificationBell";
import { IdleLogout } from "@/components/auth/IdleLogout";
import { cn } from "@/lib/utils";

export function PortalShell({
  user,
  notifications,
  children,
}: {
  user: { name: string; email: string; avatar: string | null };
  notifications: NotificationItem[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const navLink = (href: string, label: string, Icon: typeof ListTodo) => (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        pathname === href ? "bg-primary/10 text-primary" : "text-foreground-muted hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background-2">
      <IdleLogout loginPath="/portal/login" />
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-card-border bg-surface/80 px-4 backdrop-blur-xl md:px-6">
        <Link href="/portal" className="flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <span className="hidden font-display text-lg font-bold text-foreground sm:block">پنل کاربران</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLink("/portal", "تسک‌های من", ListTodo)}
          {navLink("/portal/calendar", "تقویم تیم", CalendarDays)}
        </nav>
        <div className="mr-auto flex items-center gap-3">
          <NotificationBell initial={notifications} />
          <ThemeToggle />
          <p className="hidden text-sm font-semibold text-foreground sm:block">{user.name}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar || `https://i.pravatar.cc/80?u=${user.email}`}
            alt={user.name}
            className="h-9 w-9 rounded-full border border-card-border object-cover"
          />
          <button
            onClick={logout}
            aria-label="خروج"
            className="grid h-10 w-10 place-items-center rounded-lg text-foreground-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4 md:p-8">{children}</main>
    </div>
  );
}
