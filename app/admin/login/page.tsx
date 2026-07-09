"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { SITE } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ورود");
        setLoading(false);
        return;
      }
      const from = new URLSearchParams(window.location.search).get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("خطای شبکه. دوباره تلاش کنید.");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* brand side */}
      <div className="relative hidden overflow-hidden lg:flex">
        <div className="reel-bg absolute inset-0" />
        <div className="absolute inset-0 bg-navy-ink/50" />
        <div className="absolute inset-0 dotgrid opacity-30" />
        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <Logo tagline mono className="text-white [&_*]:text-white" />
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-5xl font-extrabold leading-tight text-white"
            >
              پنل مدیریت
              <br />
              <span className="text-sky">آرکا استودیو</span>
            </motion.h2>
            <p className="mt-5 max-w-md text-lg text-white/70">
              کنترل کامل محتوا، نمونه‌کارها، کمپین‌ها و تیم؛ همه در یک داشبورد یکپارچه و امن.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["نمونه‌کار", "ژورنال", "رسانه", "CRM", "سئو", "کاربران"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <ShieldCheck className="h-4 w-4" />
            ورود امن با رمزنگاری و کنترل دسترسی نقش‌محور (RBAC)
          </div>
        </div>
      </div>

      {/* form side */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <LogoMark className="h-11 w-11" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">خوش آمدید 👋</h1>
          <p className="mt-2 text-foreground-muted">برای ورود به پنل مدیریت، وارد شوید.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">ایمیل</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  required
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-card-border bg-surface pr-10 pl-4 text-left text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="you@arka.studio"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">رمز عبور</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-card-border bg-surface pr-10 pl-11 text-left text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-faint hover:text-foreground"
                  aria-label={show ? "پنهان کردن" : "نمایش"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ورود به پنل"}
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            بازگشت به سایت {SITE.nameEn}
          </Link>
        </div>
      </div>
    </div>
  );
}
