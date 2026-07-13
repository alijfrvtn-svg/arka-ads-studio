"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function PortalShell({
  user,
  children,
}: {
  user: { name: string; email: string; avatar: string | null };
  children: React.ReactNode;
}) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background-2">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-card-border bg-surface/80 px-4 backdrop-blur-xl md:px-6">
        <Link href="/portal" className="flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <span className="font-display text-lg font-bold text-foreground">پنل کاربران</span>
        </Link>
        <div className="mr-auto flex items-center gap-3">
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
