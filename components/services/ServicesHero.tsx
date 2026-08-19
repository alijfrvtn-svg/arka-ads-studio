"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { DEPARTMENTS, DEPARTMENT_PAINT } from "@/lib/constants";
import { labelOn, cn } from "@/lib/utils";
import { tr } from "@/lib/i18n";
import type { Locale } from "@/types";

/**
 * The hero that turns into the page.
 *
 * It opens as four full-height bands, one per department, filling the screen —
 * no title, because four department names at display size already say what the
 * studio does. Scrolling compresses them: the bands shrink to the height of the
 * bars that head each section further down, and the page's own title and copy
 * rise into the space they leave. By the time the pin releases, the hero has
 * become a row of department bars that link into the page.
 *
 * It is not decoration that scrolls away. The same four objects are the poster,
 * the transition and the navigation.
 *
 * ── The resting state is the END state ────────────────────────────────────
 * Every CSS class here draws the compressed hero: four bars and a title, which
 * is a complete, correct hero on its own. The scroll only ever expands that.
 * So if the pin never engages — no JS, a stalled frame clock, a browser that
 * ignores `svh` — what is left is the finished thing rather than an empty
 * screen, and mobile and reduced-motion get the same by simply not pinning.
 */

/** How tall the track is. One extra viewport of scroll to run the transition
 *  in, then the pin releases. */
const TRACK = "180svh";

/** The transition is done by here; the rest of the track is a hold, so the
 *  unpin does not land in the middle of the movement. */
const DONE = 0.72;

const COPY: Record<Locale, { hint: string }> = {
  fa: { hint: "برای دیدن خدمات هر دپارتمان اسکرول کنید" },
  en: { hint: "Scroll to open each department" },
  ar: { hint: "مرّر لفتح كل قسم" },
};

export function ServicesHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  locale = "fa",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  breadcrumb: { label: string; href?: string }[];
  locale?: Locale;
}) {
  const reduced = useReducedMotion();
  const c = COPY[locale] ?? COPY.fa;
  const trackRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // Smoothed, or the bands step with every scroll tick instead of gliding.
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });

  // Percentages, not pixels: they resolve against the stage, which is a
  // definite height, so the same numbers hold on any screen.
  const bandH = useTransform(p, [0, DONE], ["23.5%", "12%"]);
  const labelScale = useTransform(p, [0, DONE], [1, 0.62]);
  const copyOpacity = useTransform(p, [DONE * 0.55, DONE * 0.98], [0, 1]);
  const copyY = useTransform(p, [DONE * 0.55, DONE * 0.98], [28, 0]);
  const hintOpacity = useTransform(p, [0, 0.18], [1, 0]);

  /**
   * Pin only where there is room and a real pointer.
   *
   * A viewport-tall pinned section on a phone fights the address bar, costs a
   * full extra screen of scrolling before anything happens, and gives back
   * bands 92px tall — which is what the unpinned layout shows immediately. It
   * starts false so the server and the first paint both render the resting
   * state, and only turns on once the query has actually been asked.
   */
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const pinned = wide && !reduced;

  return (
    <section
      ref={trackRef}
      className="relative"
      // Only the pinned layout needs a tall track. Reduced motion gets the
      // resting state and nothing to scroll through.
      style={pinned ? { height: TRACK } : undefined}
    >
      <div
        className={cn(
          "flex flex-col gap-2 overflow-hidden px-5 pb-10 pt-28 md:px-8 md:pt-32",
          pinned ? "sticky top-0 h-[100svh]" : "h-auto",
        )}
      >
        {DEPARTMENTS.map((dept) => {
          const colour = DEPARTMENT_PAINT[dept.key] ?? "#FF6B5B";
          // Computed per hex, never paired by hand — the four span a coral, a
          // blue, a green and a gold, and one fixed label colour fails on two
          // of them. Floor across the set is 5.18:1.
          const label = labelOn(colour);
          const onDark = label === "#ffffff";
          return (
            <motion.div
              key={dept.key}
              // The band's resting height is the bar height; the scroll only
              // grows it. `h-[92px]` is the fallback if the value never lands.
              className="relative isolate h-[92px] shrink-0 overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem]"
              style={pinned ? { background: colour, color: label, height: bandH } : { background: colour, color: label }}
            >
              {/* The same cast-glass shell as every other coloured surface on
                  the site. Its host has to be positioned — see .crystal. */}
              <span className="crystal" aria-hidden />

              <Link
                href={`#dept-${dept.key}`}
                className="relative flex h-full items-center justify-between gap-4 px-6 md:px-9"
              >
                <motion.span
                  className="flex min-w-0 items-center gap-4 md:gap-5"
                  // Scaled rather than restyled: one element, one transform,
                  // and no font-size crossfade to go out of step with the box.
                  style={pinned ? { scale: labelScale, transformOrigin: "right center" } : undefined}
                >
                  <span
                    className={cn(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border md:h-14 md:w-14",
                      onDark ? "border-white/35 bg-white/15" : "border-black/20 bg-black/[0.07]",
                    )}
                  >
                    <Icon name={dept.icon} className="h-6 w-6" />
                  </span>
                  {/* `truncate` only from lg. The band is 183px wide on a
                      phone and these names are longer than that — "برندینگ و
                      طراحی گرافیک" wants 230px, "مارکتینگ و استراتژی محتوا"
                      wants 250 — so every department was arriving with its own
                      name cut off mid-word behind an ellipsis. It is the label
                      of the whole slide; it wraps instead. */}
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-extrabold leading-snug tracking-tight md:text-4xl lg:truncate">
                      {tr(locale, dept.title, dept.titleEn, dept.titleAr)}
                    </span>
                    {locale === "fa" && (
                      <span className="mt-1 block text-[0.72rem] uppercase leading-snug tracking-[0.14em] opacity-85 lg:truncate lg:text-[0.65rem] lg:tracking-[0.24em]">
                        {dept.titleEn}
                      </span>
                    )}
                  </span>
                </motion.span>

                <ChevronLeft className="h-6 w-6 shrink-0 opacity-70" aria-hidden />
              </Link>
            </motion.div>
          );
        })}

        {/* The page's own copy, in the room the bands give back. */}
        <motion.div
          className="min-h-0 flex-1 pt-8 md:pt-10"
          style={pinned ? { opacity: copyOpacity, y: copyY } : undefined}
        >
          <nav className="-mx-2 mb-4 flex flex-wrap items-center text-xs text-foreground-faint">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.href ? (
                  <Link href={b.href} className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-foreground">
                    {b.label}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 items-center px-2 text-foreground-muted">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <ChevronLeft className="h-3 w-3" />}
              </span>
            ))}
          </nav>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground balance sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">{description}</p>
        </motion.div>
      </div>

      {/* Shown only while the bands are still full height, and only where there
          is a pin to explain. */}
      {pinned && (
        <motion.span
          aria-hidden
          style={{ opacity: hintOpacity }}
          className="pointer-events-none sticky bottom-6 z-10 mx-auto block w-fit rounded-full bg-foreground/85 px-4 py-2 text-[0.78rem] font-medium text-background backdrop-blur lg:text-[0.7rem]"
        >
          {c.hint}
        </motion.span>
      )}
    </section>
  );
}
