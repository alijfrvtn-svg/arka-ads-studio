"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpLeft, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { NAV, DEPARTMENTS } from "@/lib/constants";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Department, Locale } from "@/types";

const NAV_KEY: Record<string, string> = {
  "/": "navHome",
  "/services": "navServices",
  "/work": "navWork",
  "/industries": "navIndustries",
  "/about": "navAbout",
  "/journal": "navJournal",
  "/contact": "navContact",
};

export function SiteHeader({
  services,
  industries,
  locale,
}: {
  services: { slug: string; title: string; department: Department }[];
  industries: { slug: string; title: string }[];
  locale: Locale;
}) {
  const t = ui(locale);
  const navLabel = (href: string) => (t as Record<string, string>)[NAV_KEY[href]] ?? href;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<null | "services" | "industries">(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
      onMouseLeave={() => setMega(null)}
    >
      <div className="container-x">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 transition-all duration-500 md:px-5",
            scrolled ? "glass h-14 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.6)]" : "h-16",
          )}
        >
          <Link href="/" aria-label="آرکا" className="shrink-0">
            <Logo tagline={!scrolled} />
          </Link>

          {/* desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const hasMega =
                item.href === "/services" ? "services" : item.href === "/industries" ? "industries" : null;
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMega(hasMega as any)}
                >
                  <Link
                    href={item.href}
                    data-active={isActive(item.href)}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-primary"
                        : "text-foreground-muted hover:text-foreground",
                    )}
                  >
                    {navLabel(item.href)}
                    {hasMega && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} className="hidden sm:block" />
            <ThemeToggle />
            <div className="hidden md:block">
              <Magnetic strength={0.4}>
                <Button href="/contact" size="sm" variant="glow" className="gap-1.5">
                  {t.ctaStartProject}
                  <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Magnetic>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="منو"
              className="grid h-10 w-10 place-items-center rounded-full border border-card-border bg-surface/60 text-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* mega menu */}
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full hidden px-[max(1.25rem,calc((100vw-1360px)/2+1.25rem))] pt-3 lg:block"
              onMouseEnter={() => setMega(mega)}
            >
              <div className="glass overflow-hidden rounded-2xl border border-card-border p-2 shadow-2xl">
                {mega === "services" ? (
                  <div className="grid grid-cols-4 gap-2">
                    {DEPARTMENTS.map((d) => (
                      <div key={d.key} className="rounded-xl p-3">
                        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {d.title}
                        </p>
                        <div className="flex flex-col">
                          {services.filter((s) => s.department === d.key).map((s) => (
                            <Link
                              key={s.slug}
                              href={`/services/${s.slug}`}
                              className="rounded-lg px-2 py-1.5 text-sm text-foreground-muted transition-colors hover:bg-card-hover hover:text-foreground"
                            >
                              {s.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {industries.map((i) => (
                      <Link
                        key={i.slug}
                        href={`/industries/${i.slug}`}
                        className="rounded-lg px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-card-hover hover:text-foreground"
                      >
                        {i.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[72px] z-40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="container-x flex flex-col gap-1 py-6">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between border-b border-card-border py-4 text-lg font-medium",
                      isActive(item.href) ? "text-primary" : "text-foreground",
                    )}
                  >
                    {navLabel(item.href)}
                    {item.desc && locale === "fa" && (
                      <span className="text-xs font-normal text-foreground-faint">{item.desc}</span>
                    )}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 flex justify-center sm:hidden">
                <LanguageSwitcher locale={locale} />
              </div>
              <Button href="/contact" size="lg" variant="glow" className="mt-6 w-full">
                {t.ctaStartProject}
                <ArrowUpLeft className="h-5 w-5" />
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
