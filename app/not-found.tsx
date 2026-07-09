import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center overflow-hidden px-6 text-center">
      <div className="hero-grid absolute inset-0 opacity-40" />
      <div className="relative">
        <LogoMark className="mx-auto h-16 w-16" />
        <h1 className="mt-8 font-display text-8xl font-extrabold text-gradient md:text-9xl">۴۰۴</h1>
        <p className="mt-4 text-xl font-bold text-foreground">این صفحه پیدا نشد</p>
        <p className="mt-2 text-foreground-muted">شاید صفحه جابه‌جا شده یا هرگز وجود نداشته است.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
