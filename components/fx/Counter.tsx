"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { localeNumber } from "@/lib/utils";
import type { Locale } from "@/types";

/** Count-up animation, triggered when scrolled into view — digits follow the active locale. */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1900,
  className,
  locale = "fa",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  locale?: Locale;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {localeNumber(locale, n)}
      {suffix}
    </span>
  );
}
