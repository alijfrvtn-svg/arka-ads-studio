import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

/**
 * Shown to signed-in CMS staff while maintenance mode is on — they are let
 * through to the real site, so without this there is no on-page signal that
 * the site is closed to everyone else.
 */
export function MaintenanceBanner() {
  return (
    // Was an amber warning strip. With no palette to raise an alarm with, the
    // banner takes the loudest thing the site has instead: full-bleed ink with
    // the type knocked out of it.
    <div className="relative z-[60] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-foreground px-4 py-2.5 text-center text-xs font-semibold text-background sm:text-sm">
      <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
      <span>حالت تعمیر و نگهداری روشن است — بازدیدکنندگان صفحه‌ی «در حال تعمیر» را می‌بینند.</span>
      <span className="opacity-80">شما چون وارد پنل شده‌اید سایت را عادی می‌بینید.</span>
      <Link href="/admin/settings" className="underline underline-offset-2 hover:opacity-70">
        خاموش کردن
      </Link>
    </div>
  );
}

export function MaintenanceScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <div className="mb-8 flex justify-center">
          <Logo className="h-8" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-foreground md:text-4xl">
          سایت موقتاً در حال تعمیر و نگهداری است
        </h1>
        <p className="mx-auto mt-5 max-w-md text-foreground-muted">
          به‌زودی برمی‌گردیم. از صبر شما سپاسگزاریم.
        </p>
      </div>
    </div>
  );
}
