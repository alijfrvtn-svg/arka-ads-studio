"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpLeft, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { SiteSearch } from "@/components/search/SiteSearch";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
// LanguageSwitcher import removed while multi-language is paused — component kept at
// components/layout/LanguageSwitcher.tsx for re-enabling later.
import { NAV } from "@/lib/constants";
import { tr, ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CategoryItem } from "@/lib/queries";
import type { Locale } from "@/types";

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
  departments,
  locale,
}: {
  services: { slug: string; title: string; department: string }[];
  industries: { slug: string; title: string }[];
  // Editable in /admin/categories (kind DEPARTMENT).
  departments: CategoryItem[];
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

  /**
   * Routes that open on a full-bleed film running under the header.
   *
   * Unscrolled the bar has no glass, so ink type would sit straight on the
   * footage — readable over a lit sky and invisible the moment the reel cuts
   * to black. The attribute inverts the header's tokens for exactly as long
   * as the bar is bare; see header[data-over-media] in globals.css.
   */
  const overMedia = pathname === "/work" && !scrolled;

  return (
    <header
      data-over-media={overMedia || undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 [transition-timing-function:var(--ease-apple)]",
        scrolled ? "py-2.5" : "py-5",
      )}
      onMouseLeave={() => setMega(null)}
    >
      <div className="container-x">
        {/* Unscrolled the bar is invisible and the page reads as one sheet of
            paper; on scroll it condenses into a floating pane of glass that
            refracts the content sliding under it. */}
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 transition-all duration-700 [transition-timing-function:var(--ease-apple)] md:px-6",
            scrolled ? "glass glass-strong liquid-refract h-14" : "h-16 border border-transparent",
          )}
        >
          <Link href="/" aria-label="آرکا" className="shrink-0">
            <Logo className={scrolled ? "h-6" : "h-7"} />
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
                      // Hue used to carry "you are here"; now weight and ink
                      // density do, which is the only honest way to signal
                      // state in a monochrome system.
                      "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                      isActive(item.href)
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground-muted hover:text-foreground",
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
          <div className="flex items-center gap-1.5 sm:gap-2">
            <SiteSearch />
            <div className="hidden md:block">
              <Magnetic strength={0.4}>
                <Button href="/contact" size="sm" variant="glow" className="gap-1.5" data-track="header-cta">
                  {t.ctaStartProject}
                  <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Magnetic>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="منو"
              className="liquid liquid-clear grid h-11 w-11 place-items-center rounded-full text-foreground lg:hidden"
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
              {/* Glassmorphism: the panel is translucent white over a heavy
                  blur, so whatever the page is showing underneath — a hero
                  card deck, the marquee — stays faintly present instead of
                  being covered by a flat sheet. `saturate` is what stops the
                  blurred backdrop going muddy. */}
              <div className="menu-glass overflow-hidden rounded-[1.75rem] p-3">
                {mega === "services" ? (
                  <div className="grid grid-cols-4 gap-2">
                    {departments.map((d) => (
                      // Hovering a column lifts that department alone: a soft
                      // wash plus its own icon blown up as a watermark behind
                      // the list. The watermark is decorative and sits at very
                      // low alpha, so it never competes with the link text.
                      <div key={d.slug} className="menu-col group/col relative overflow-hidden rounded-2xl p-4">
                        <Icon
                          name={d.icon}
                          aria-hidden
                          className="menu-col-mark pointer-events-none absolute -left-4 -top-4 h-28 w-28"
                        />
                        <p className="relative mb-3 flex items-center gap-2 text-xs font-bold tracking-wide text-foreground">
                          <span className="h-1 w-1 rounded-full bg-accent" />
                          {tr(locale, d.title, d.titleEn, d.titleAr)}
                        </p>
                        <div className="relative flex flex-col">
                          {services.filter((s) => s.department === d.slug).map((s) => (
                            <Link
                              key={s.slug}
                              href={`/services/${s.slug}`}
                              className="rounded-lg px-2 py-1.5 text-sm text-foreground-muted transition-colors duration-300 hover:bg-card-hover hover:text-foreground"
                            >
                              {s.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Same glass panel and the same hover wash as the services
                  // columns — this menu is a flat list rather than four
                  // columns, so the wash lands on each item instead of a
                  // column, and there is no icon on an industry to watermark.
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {industries.map((i) => (
                      <Link
                        key={i.slug}
                        href={`/industries/${i.slug}`}
                        className="menu-col rounded-xl px-3.5 py-2.5 text-sm text-foreground-muted hover:text-foreground"
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
            className="fixed inset-0 top-[72px] z-40 bg-background/90 backdrop-blur-2xl lg:hidden"
          >
            <nav className="container-x flex flex-col gap-1 py-8">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045, ease: [0.28, 0.11, 0.32, 1] }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between border-b border-card-border py-5 text-lg tracking-tight",
                      isActive(item.href) ? "font-bold text-foreground" : "font-medium text-foreground-muted",
                    )}
                  >
                    {navLabel(item.href)}
                    {item.desc && locale === "fa" && (
                      <span className="text-xs font-normal text-foreground-faint">{item.desc}</span>
                    )}
                  </Link>
                </motion.div>
              ))}
              <Button href="/contact" size="lg" variant="glow" className="mt-8 w-full" data-track="mobile-nav-cta">
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
