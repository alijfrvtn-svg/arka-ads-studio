"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Cormorant_Garamond, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { ArrowUpLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ui } from "@/lib/i18n";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

const DESKTOP_QUERY = "(min-width: 1024px)";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], display: "swap" });

const FONT_SERIF = `${cormorant.style.fontFamily}, serif`;
const FONT_DISPLAY = `${spaceGrotesk.style.fontFamily}, sans-serif`;
const FONT_MONO = `${plexMono.style.fontFamily}, monospace`;

type Length = "compact" | "standard" | "epic";
const LENGTH_VH: Record<Length, number> = { compact: 440, standard: 640, epic: 900 };

/**
 * Ported from a bundled scroll-driven artifact ("Eye of Creation") built for
 * this exact brand (colors/logo/slogan match lib/constants.ts SITE). Progress
 * is scoped to this component's own scaffold via getBoundingClientRect —
 * unlike the original (which read document.documentElement.scrollHeight),
 * so it behaves as one hero section among others, not a whole-page takeover.
 */
function computeVals(p: number, showScrollHint: boolean, isLight: boolean) {
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const rng = (x: number, a: number, b: number) => clamp((x - a) / (b - a), 0, 1);
  const sm = (t: number) => t * t * (3 - 2 * t);
  const seg = (x: number, a: number, b: number) => sm(rng(x, a, b));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // The lens/tunnel/panels are treated as "hardware" (a camera lens is dark
  // glass regardless of room light) and stay constant; only the surrounding
  // stage + finale text — which read as page chrome, not a physical object —
  // swap with the site's light/dark theme.
  const stage = isLight
    ? {
        bg: "#f5f8fe",
        radial: "radial-gradient(120% 120% at 50% 46%, #ffffff 0%, #eef3fc 45%, #dde6f5 100%)",
        vignette: "radial-gradient(70% 70% at 50% 48%, transparent 40%, rgba(10,19,46,0.12) 100%)",
        floodBg:
          "radial-gradient(60% 100% at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(166,201,255,0.65) 30%, rgba(166,201,255,0.3) 55%, transparent 78%), linear-gradient(120deg, transparent 20%, rgba(43,86,214,0.18) 48%, transparent 62%)",
        logoColor: "#0a132e",
        logoShadow: "0 2px 30px rgba(43,86,214,0.18)",
        taglineColor: "rgba(43,86,214,0.85)",
        servicesColor: "rgba(10,19,46,0.55)",
        hintColor: "rgba(10,19,46,0.55)",
        progressGrad: "linear-gradient(90deg, rgba(43,86,214,0.35), #2b56d6)",
        progressGlow: "0 0 10px rgba(43,86,214,0.4)",
      }
    : {
        bg: "#050506",
        radial: "radial-gradient(120% 120% at 50% 46%, #0b0b0f 0%, #060608 45%, #030304 100%)",
        vignette: "radial-gradient(70% 70% at 50% 48%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        floodBg:
          "radial-gradient(60% 100% at 50% 50%, rgba(255,250,240,0.98) 0%, rgba(166,201,255,0.85) 30%, rgba(166,201,255,0.4) 55%, transparent 78%), linear-gradient(120deg, transparent 20%, rgba(255,240,214,0.5) 48%, transparent 62%)",
        logoColor: "#f6efe2",
        logoShadow: "0 2px 40px rgba(166,201,255,0.25)",
        taglineColor: "rgba(166,201,255,0.9)",
        servicesColor: "rgba(240,232,218,0.55)",
        hintColor: "rgba(230,225,215,0.6)",
        progressGrad: "linear-gradient(90deg, rgba(166,201,255,0.5), #a6c9ff)",
        progressGlow: "0 0 10px rgba(166,201,255,0.6)",
      };

  let phaseLabel = "Silhouette";
  if (p >= 0.9) phaseLabel = "Finale";
  else if (p >= 0.6) phaseLabel = "Reflections";
  else if (p >= 0.3) phaseLabel = "Diving";
  else if (p >= 0.1) phaseLabel = "Awakening";

  const dive = seg(p, 0.3, 0.56);
  const lensScale = 1 + dive * 9;
  const lensOpacity = 1 - seg(p, 0.4, 0.54);
  const lensGroupStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "50%", width: 0, height: 0,
    zIndex: 20, transformOrigin: "center",
    transform: `translate(-50%,-50%) scale(${lensScale.toFixed(3)})`,
    opacity: lensOpacity,
    willChange: "transform, opacity",
  };

  const lock = seg(p, 0.08, 0.28);
  const rotA = lerp(-34, 96, lock) + dive * 40;
  const rotB = lerp(26, -74, lock) - dive * 40;
  const ringGlow = 0.25 + lock * 0.75;
  const focalRingAStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "50%", width: "58vh", height: "58vh",
    marginLeft: "-29vh", marginTop: "-29vh", borderRadius: "50%",
    transform: `rotate(${rotA.toFixed(1)}deg)`,
    background: "repeating-conic-gradient(from 0deg, rgba(210,220,235,0.0) 0deg 4deg, rgba(210,220,235,0.5) 4deg 4.5deg)",
    WebkitMask: "radial-gradient(circle, transparent 26vh, #000 26vh, #000 29vh, transparent 29vh)",
    mask: "radial-gradient(circle, transparent 26vh, #000 26vh, #000 29vh, transparent 29vh)",
    opacity: 0.4 + ringGlow * 0.6,
  };
  const focalRingBStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "50%", width: "50vh", height: "50vh",
    marginLeft: "-25vh", marginTop: "-25vh", borderRadius: "50%",
    transform: `rotate(${rotB.toFixed(1)}deg)`,
    background: "repeating-conic-gradient(from 0deg, rgba(166,201,255,0) 0deg 9deg, rgba(166,201,255,0.55) 9deg 10deg)",
    WebkitMask: "radial-gradient(circle, transparent 22vh, #000 22vh, #000 25vh, transparent 25vh)",
    mask: "radial-gradient(circle, transparent 22vh, #000 22vh, #000 25vh, transparent 25vh)",
    opacity: 0.35 + ringGlow * 0.55,
  };

  const rim = 1 - seg(p, 0.12, 0.34) * 0.4;
  const rimStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "50%", width: "76vh", height: "76vh",
    marginLeft: "-38vh", marginTop: "-38vh", borderRadius: "50%",
    background: "conic-gradient(from 200deg, transparent 0deg, rgba(166,201,255,0.85) 40deg, rgba(166,201,255,0.95) 62deg, rgba(166,201,255,0.7) 84deg, transparent 130deg)",
    WebkitMask: "radial-gradient(circle, transparent 36vh, #000 37vh)",
    mask: "radial-gradient(circle, transparent 36vh, #000 37vh)",
    filter: "blur(2px)", opacity: rim,
    animation: "eoc-flicker 6s ease-in-out infinite",
  };

  const glassGlow = seg(p, 0.14, 0.5);
  const glassStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "50%", width: "40vh", height: "40vh",
    marginLeft: "-20vh", marginTop: "-20vh", borderRadius: "50%", overflow: "hidden",
    background: `radial-gradient(circle at 46% 42%, rgba(90,150,210,${(0.14 + glassGlow * 0.3).toFixed(3)}) 0%, rgba(24,34,52,0.9) 42%, #05070c 78%)`,
    boxShadow: `inset 0 0 60px rgba(0,0,0,0.9), inset 0 0 30px rgba(120,180,240,${(0.1 + glassGlow * 0.4).toFixed(3)})`,
  };
  const glassShimmerStyle: CSSProperties = {
    position: "absolute", left: "-30%", top: "-30%", width: "160%", height: "160%",
    background: "conic-gradient(from 0deg, transparent 0deg, rgba(150,200,255,0.14) 30deg, transparent 70deg, transparent 360deg)",
    animation: "eoc-shimmer 14s linear infinite", pointerEvents: "none",
  };
  const sloganOpacity = 0.85 * (1 - seg(p, 0.2, 0.34));
  const sloganStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
    textAlign: "center", fontFamily: FONT_SERIF, fontWeight: 400,
    fontSize: "5vh", lineHeight: 1.05, letterSpacing: "0.04em",
    color: "rgba(198,222,255,0.92)", textShadow: "0 0 22px rgba(120,180,255,0.5)",
    filter: "blur(0.4px)", opacity: sloganOpacity,
  };

  const core = seg(p, 0.24, 0.46) * (1 - seg(p, 0.9, 1));
  const coreGlowStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "50%", width: "90vh", height: "90vh",
    marginLeft: "-45vh", marginTop: "-45vh", borderRadius: "50%", zIndex: 6,
    background: "radial-gradient(circle, rgba(150,200,255,0.35) 0%, rgba(90,140,220,0.12) 30%, transparent 62%)",
    filter: "blur(6px)", opacity: core, pointerEvents: "none",
  };

  const diveT = rng(p, 0.32, 0.99);
  const tOp = seg(p, 0.34, 0.46) * (1 - seg(p, 0.93, 1));
  const tunnelStyle: CSSProperties = { position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none" };
  const N = 9;
  const rings: { style: CSSProperties }[] = [];
  for (let i = 0; i < N; i++) {
    let local = diveT * 4 + i / N;
    local = local - Math.floor(local);
    const scale = 0.04 + local * local * 7;
    const op = Math.sin(local * Math.PI) * 0.5 * tOp;
    const hue = i % 2 === 0 ? "150,200,255" : "166,201,255";
    rings.push({
      style: {
        position: "absolute", left: "50%", top: "50%", width: "60vh", height: "60vh",
        marginLeft: "-30vh", marginTop: "-30vh", borderRadius: "50%",
        border: `2px solid rgba(${hue},0.9)`,
        boxShadow: `0 0 40px rgba(${hue},0.35), inset 0 0 40px rgba(${hue},0.25)`,
        transform: `translateZ(0) scale(${scale.toFixed(3)})`,
        opacity: op,
      },
    });
  }

  const lightsStyle: CSSProperties = { position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none" };
  const beamCfg = [
    { left: "18%", top: "-10%", rot: "24deg", w: "22vh", h: "85vh" },
    { left: "40%", top: "-14%", rot: "8deg", w: "24vh", h: "92vh" },
    { left: "60%", top: "-14%", rot: "-8deg", w: "24vh", h: "92vh" },
    { left: "82%", top: "-10%", rot: "-24deg", w: "22vh", h: "85vh" },
    { left: "50%", top: "-16%", rot: "0deg", w: "17vh", h: "96vh" },
  ];
  const beams = beamCfg.map((b, i) => {
    const on = seg(p, 0.1 + i * 0.03, 0.22 + i * 0.03);
    const off = seg(p, 0.42, 0.56);
    const op = on * (1 - off);
    return {
      style: {
        position: "absolute" as const, left: b.left, top: b.top, width: b.w, height: b.h,
        transformOrigin: "top center",
        transform: `translateX(-50%) rotate(${b.rot})`,
        background: "linear-gradient(to bottom, rgba(190,216,255,0.55), rgba(166,201,255,0.22) 42%, rgba(166,201,255,0.06) 68%, transparent 84%)",
        filter: "blur(7px)", borderRadius: "0 0 50% 50%",
        opacity: op,
      },
      flareStyle: {
        position: "absolute" as const, left: b.left, top: b.top, width: "15vh", height: "15vh",
        marginLeft: "-7.5vh", marginTop: "-7.5vh", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(190,216,255,0.75) 20%, rgba(166,201,255,0.35) 42%, transparent 66%)",
        transform: `scale(${(0.5 + on * 1.1).toFixed(2)})`,
        opacity: op,
        animation: "eoc-flicker 5s ease-in-out infinite",
      },
    };
  });

  const neonCfg = [
    { orient: "v", left: "9%", top: "8%", len: "48vh", on: 0.12 },
    { orient: "v", left: "91%", top: "14%", len: "42vh", on: 0.15 },
    { orient: "h", left: "50%", top: "9%", len: "30vw", on: 0.1 },
    { orient: "v", left: "16%", top: "52%", len: "32vh", on: 0.2 },
    { orient: "v", left: "84%", top: "48%", len: "30vh", on: 0.23 },
    { orient: "h", left: "50%", top: "92%", len: "26vw", on: 0.17 },
  ] as const;
  const neons = neonCfg.map((n) => {
    const draw = rng(p, n.on, n.on + 0.14);
    const off = seg(p, 0.26, 0.31);
    const lit = draw > 0.001 ? 1 : 0;
    const op = lit * (1 - off);
    const vert = n.orient === "v";
    return {
      style: {
        position: "absolute" as const, left: n.left, top: n.top,
        width: vert ? "2px" : n.len, height: vert ? n.len : "2px",
        marginLeft: vert ? "-1px" : `calc(${n.len} / -2)`,
        background: "rgba(166,201,255,0.95)",
        boxShadow: "0 0 6px rgba(166,201,255,0.9), 0 0 16px rgba(166,201,255,0.7), 0 0 34px rgba(166,201,255,0.5)",
        borderRadius: "2px",
        transformOrigin: vert ? "top center" : "left center",
        transform: vert ? `scaleY(${draw.toFixed(3)})` : `scaleX(${draw.toFixed(3)})`,
        opacity: op,
        animation: "eoc-electric 1.4s ease-in-out infinite",
      },
    };
  });

  const panel = (a: number, b: number, tiltA: number, tiltB: number, z: number) => {
    const local = rng(p, a, b);
    const inO = seg(p, a, a + 0.025);
    const outO = seg(p, b - 0.045, b);
    const opacity = inO * (1 - outO);
    const scale = lerp(0.72, 1.95, local);
    const ry = lerp(tiltA, tiltB, local);
    const style: CSSProperties = {
      position: "absolute", left: "50%", top: "50%",
      width: "min(58vw,760px)", height: "min(40vh,440px)",
      transformOrigin: "center", zIndex: z,
      transform: `translate(-50%,-50%) perspective(1100px) rotateY(${ry.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
      opacity, willChange: "transform, opacity",
    };
    return { style, local };
  };
  const film = panel(0.56, 0.72, -18, -4, 30);
  const code = panel(0.7, 0.83, 16, 4, 31);
  const photo = panel(0.82, 0.93, -14, -2, 32);

  const droneStyle: CSSProperties = {
    position: "absolute", top: `${lerp(24, 60, film.local).toFixed(0)}%`,
    left: `${lerp(16, 82, film.local).toFixed(0)}%`, width: 2, height: 2,
    transform: "translate(-50%,-50%)",
  };

  const codeLocal = code.local;
  const lineDefs = [88, 62, 74, 46, 80, 58];
  const lineColors = [
    "linear-gradient(90deg,#6699ff,#d3ebfe)", "linear-gradient(90deg,#d3ebfe,#6699ff)",
    "linear-gradient(90deg,#6699ff,#162D73)", "linear-gradient(90deg,#2f4a9c,#2f4a9c)",
    "linear-gradient(90deg,#6699ff,#d3ebfe)", "linear-gradient(90deg,#d3ebfe,#6699ff)",
  ];
  const reveal = codeLocal * (lineDefs.length + 2);
  const codeLines = lineDefs.map((w, i) => {
    const fill = clamp(reveal - i, 0, 1);
    return {
      n: i + 1,
      barStyle: {
        display: "inline-block", height: "10px", borderRadius: "3px",
        width: `${(w * fill).toFixed(1)}%`, background: lineColors[i],
        opacity: fill > 0.02 ? 0.9 : 0,
      } as CSSProperties,
    };
  });
  const cursorLineNum = Math.min(lineDefs.length + 1, Math.floor(reveal) + 1);

  const flash = Math.max(0, 1 - Math.abs(photo.local - 0.42) * 5);
  const flashStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "32%", width: "80%", height: "80%",
    marginLeft: "-40%", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,252,245,0.95) 0%, rgba(255,238,214,0.45) 26%, transparent 60%)",
    transform: `scale(${(0.5 + flash * 1.1).toFixed(2)})`,
    opacity: flash * 0.95, pointerEvents: "none",
  };

  // Finale — spread generously across the last ~15% of scroll (was crammed
  // into the last ~5-10%, which read as sudden/instant) so each element
  // eases in gradually and the cascade feels cinematic, not a jump-cut.
  const flood = seg(p, 0.85, 0.93);
  const floodOut = seg(p, 0.93, 1);
  const leakStyle: CSSProperties = {
    position: "absolute", inset: 0, zIndex: 40, pointerEvents: "none",
    background: stage.floodBg,
    opacity: flood * (1 - floodOut * 0.92),
    filter: "blur(3px)",
  };
  const logoIn = seg(p, 0.87, 0.96);
  const logoStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "40%", zIndex: 50, textAlign: "center",
    whiteSpace: "nowrap", transform: `translate(-50%,-50%) scale(${lerp(1.09, 1, seg(p, 0.87, 0.97)).toFixed(3)})`,
    opacity: logoIn,
  };
  const taglineStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "52%", zIndex: 50, textAlign: "center",
    transform: "translate(-50%,-50%)", opacity: seg(p, 0.9, 0.98),
  };
  const servicesIn = seg(p, 0.93, 0.99);
  const servicesStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "61%", zIndex: 50,
    display: "flex", alignItems: "center", gap: "22px",
    transform: `translate(-50%,-50%) translateY(${lerp(22, 0, servicesIn).toFixed(1)}px)`,
    opacity: servicesIn,
  };

  // Persian CTA — the very last thing to appear, once the cinematic reveal has landed.
  const ctaIn = seg(p, 0.96, 1);
  const ctaStyle: CSSProperties = {
    position: "absolute", left: "50%", top: "76%", zIndex: 50,
    display: "flex", flexDirection: "column", alignItems: "center", gap: "18px",
    transform: `translate(-50%,-50%) translateY(${lerp(16, 0, ctaIn).toFixed(1)}px)`,
    opacity: ctaIn,
    pointerEvents: p > 0.99 ? "auto" : "none",
  };

  const hintStyle: CSSProperties = {
    position: "absolute", left: "50%", bottom: "7%", zIndex: 45, textAlign: "center",
    transform: "translateX(-50%)", opacity: 1 - seg(p, 0, 0.03),
  };
  const progressWidth = (p * 100).toFixed(2) + "%";
  const hideHint = showScrollHint === false ? true : undefined;

  return {
    stage, phaseLabel, lensGroupStyle, focalRingAStyle, focalRingBStyle, rimStyle,
    glassStyle, glassShimmerStyle, sloganStyle, coreGlowStyle,
    tunnelStyle, rings, lightsStyle, beams, neons,
    filmStyle: film.style, codeStyle: code.style, photoStyle: photo.style,
    droneStyle, codeLines, cursorLineNum, flashStyle,
    leakStyle, logoStyle, taglineStyle, servicesStyle, ctaStyle, hintStyle, progressWidth, hideHint,
  };
}

export function EyeOfCreation({
  length = "standard",
  showScrollHint = true,
  content,
  onWatchReel,
  locale = "fa",
}: {
  length?: Length;
  showScrollHint?: boolean;
  content: HomeContent;
  onWatchReel?: () => void;
  locale?: Locale;
}) {
  const scaffoldRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);
  const { theme } = useTheme();

  // Desktop-only: below the `lg` breakpoint this component is hidden by its
  // wrapper (see Hero.tsx), so skip the scroll math entirely rather than
  // pay for it on every mobile/tablet scroll tick.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    let detachScroll: (() => void) | null = null;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const el = scaffoldRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          const raw = total > 0 ? -rect.top / total : 0;
          setProgress(Math.max(0, Math.min(1, raw)));
        }
        ticking.current = false;
      });
    };

    const sync = () => {
      if (mq.matches) {
        if (detachScroll) return;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
        detachScroll = () => {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        };
      } else {
        detachScroll?.();
        detachScroll = null;
        setProgress(0);
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      detachScroll?.();
    };
  }, []);

  const v = computeVals(progress, showScrollHint, theme === "light");
  const labelStyle: CSSProperties = { fontFamily: FONT_DISPLAY, letterSpacing: "0.28em", color: "#d3ebfe" };
  const logoImg = (
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(211,235,254,0.20) 0%, transparent 66%)", filter: "blur(4px)" }} />
  );

  return (
    <div ref={scaffoldRef} style={{ position: "relative", height: `${LENGTH_VH[length]}vh`, background: v.stage.bg }}>
      <div
        style={{
          position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden",
          background: v.stage.radial,
          perspective: "1200px",
        }}
        data-screen-label={v.phaseLabel}
      >
        <div style={{ position: "absolute", inset: 0, background: v.stage.vignette, pointerEvents: "none", zIndex: 2 }} />

        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", opacity: 0.5 }}>
          <div style={{ position: "absolute", left: "22%", top: "34%", width: 3, height: 3, borderRadius: "50%", background: "rgba(166,201,255,0.5)", filter: "blur(0.4px)", animation: "eoc-drift1 13s ease-in-out infinite" }} />
          <div style={{ position: "absolute", left: "70%", top: "28%", width: 2, height: 2, borderRadius: "50%", background: "rgba(180,215,255,0.5)", animation: "eoc-drift2 17s ease-in-out infinite" }} />
          <div style={{ position: "absolute", left: "58%", top: "62%", width: 2.5, height: 2.5, borderRadius: "50%", background: "rgba(166,201,255,0.4)", animation: "eoc-drift1 19s ease-in-out infinite" }} />
          <div style={{ position: "absolute", left: "33%", top: "70%", width: 2, height: 2, borderRadius: "50%", background: "rgba(255,240,220,0.5)", animation: "eoc-drift2 15s ease-in-out infinite" }} />
          <div style={{ position: "absolute", left: "80%", top: "58%", width: 2, height: 2, borderRadius: "50%", background: "rgba(180,215,255,0.4)", animation: "eoc-drift1 21s ease-in-out infinite" }} />
        </div>

        <div style={v.coreGlowStyle} />

        <div style={v.tunnelStyle}>
          {v.rings.map((ring, i) => (
            <div key={i} style={ring.style} />
          ))}
        </div>

        <div style={v.lightsStyle}>
          {v.beams.map((beam, i) => (
            <div key={`bs${i}`} style={beam.style} />
          ))}
          {v.beams.map((beam, i) => (
            <div key={`bf${i}`} style={beam.flareStyle} />
          ))}
          {v.neons.map((neon, i) => (
            <div key={i} style={neon.style} />
          ))}
        </div>

        {/* ===== THE LENS ===== */}
        <div style={v.lensGroupStyle}>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: "74vh", height: "74vh", marginLeft: "-37vh", marginTop: "-37vh", borderRadius: "50%", background: "radial-gradient(circle at 42% 36%, #1c1c22 0%, #0d0d11 55%, #050506 100%)", boxShadow: "inset 0 0 0 2px rgba(30,30,36,0.9), inset -14px -18px 60px rgba(0,0,0,0.9), inset 12px 10px 44px rgba(70,70,84,0.12)" }} />
          <div style={v.rimStyle} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: "64vh", height: "64vh", marginLeft: "-32vh", marginTop: "-32vh", borderRadius: "50%", background: "conic-gradient(from 0deg, #131317, #23232b, #131317, #26262f, #131317, #23232b, #131317, #26262f, #131317)", boxShadow: "inset 0 0 24px rgba(0,0,0,0.85)" }} />
          <div style={v.focalRingAStyle} />
          <div style={v.focalRingBStyle} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: "44vh", height: "44vh", marginLeft: "-22vh", marginTop: "-22vh", borderRadius: "50%", background: "radial-gradient(circle at 44% 40%, #16161c, #08080b 70%)", boxShadow: "inset 0 0 0 6px #0a0a0d, inset 0 0 30px rgba(0,0,0,0.9)" }} />
          <div style={v.glassStyle}>
            <div style={v.glassShimmerStyle} />
            <div dir="ltr" style={v.sloganStyle}>
              Design.<br />Create.<br />Impact.
            </div>
          </div>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: "40vh", height: "40vh", marginLeft: "-20vh", marginTop: "-20vh", borderRadius: "50%", background: "radial-gradient(circle at 34% 28%, rgba(200,225,255,0.16) 0%, transparent 34%)", pointerEvents: "none" }} />
        </div>

        {/* ===== REFLECTION PANELS ===== */}
        <div style={v.filmStyle}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 14, overflow: "hidden", background: "linear-gradient(180deg, #0d1b4a 0%, #162D73 46%, #1f3a86 100%)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "38%", background: "linear-gradient(180deg, transparent, rgba(102,153,255,0.30))" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: "22%", height: 1, background: "rgba(211,235,254,0.4)" }} />
            <div style={v.droneStyle}>
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 120, height: 5, margin: "-2.5px 0 0 -60px", background: "linear-gradient(90deg, transparent, #d3ebfe, transparent)", borderRadius: 3 }} />
              <div style={{ position: "absolute", left: 6, top: -4, width: 8, height: 8, borderRadius: "50%", background: "#6699ff", boxShadow: "0 0 12px #6699ff", animation: "eoc-rotorL 0.9s linear infinite" }} />
              <div style={{ position: "absolute", right: 6, top: -4, width: 8, height: 8, borderRadius: "50%", background: "#d3ebfe", boxShadow: "0 0 12px #d3ebfe", animation: "eoc-rotorL 0.9s linear infinite reverse" }} />
              <div style={{ position: "absolute", left: "50%", top: 8, width: 2, height: 130, marginLeft: -1, background: "linear-gradient(180deg, rgba(211,235,254,0.55), transparent)", filter: "blur(1px)" }} />
            </div>
            <div style={{ position: "absolute", left: "50%", top: "44%", transform: "translate(-50%,-50%)", width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {logoImg}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero/logo.png" alt="Arka Ads Studio" style={{ position: "relative", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))" }} />
            </div>
            <div dir="ltr" style={{ position: "absolute", left: 20, bottom: 16, ...labelStyle }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>FILM PRODUCTION</div>
              <div style={{ fontSize: 11, letterSpacing: "0.4em", color: "rgba(102,153,255,0.75)", marginTop: 6 }}>AERIAL CINEMATOGRAPHY</div>
            </div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 14, boxShadow: "inset 0 0 60px rgba(102,153,255,0.28), inset 0 0 0 1px rgba(211,235,254,0.35)" }} />
          </div>
        </div>

        <div style={v.codeStyle}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 14, overflow: "hidden", background: "linear-gradient(180deg, #0d1a44 0%, #162D73 100%)", fontFamily: FONT_MONO, padding: "26px 30px" }}>
            <div style={{ position: "absolute", top: 14, left: 16, display: "flex", gap: 7 }}>
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#162D73", boxShadow: "inset 0 0 0 1px rgba(211,235,254,0.4)" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#6699ff" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#d3ebfe" }} />
            </div>
            <div style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)", width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              {logoImg}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero/logo.png" alt="Arka Ads Studio" style={{ position: "relative", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))" }} />
            </div>
            <div style={{ marginTop: 26 }}>
              {v.codeLines.map((ln) => (
                <div key={ln.n} style={{ display: "flex", alignItems: "center", gap: 14, height: 24, overflow: "hidden" }}>
                  <span style={{ color: "#33463f", fontSize: 13, width: 18, textAlign: "right", flex: "none" }}>{ln.n}</span>
                  <span style={ln.barStyle} />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 14, height: 24 }}>
                <span style={{ color: "#33463f", fontSize: 13, width: 18, textAlign: "right", flex: "none" }}>{v.cursorLineNum}</span>
                <span style={{ display: "inline-block", width: 9, height: 16, background: "#6699ff", animation: "eoc-cursor 1s step-end infinite" }} />
              </div>
            </div>
            <div dir="ltr" style={{ position: "absolute", left: 30, bottom: 16, ...labelStyle }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>WEB DEVELOPMENT</div>
              <div style={{ fontSize: 11, letterSpacing: "0.4em", color: "rgba(102,153,255,0.75)", marginTop: 6 }}>EXPERIENCE ENGINEERING</div>
            </div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 14, boxShadow: "inset 0 0 60px rgba(102,153,255,0.20), inset 0 0 0 1px rgba(211,235,254,0.3)" }} />
          </div>
        </div>

        <div style={v.photoStyle}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 14, overflow: "hidden", background: "radial-gradient(90% 80% at 50% 30%, #1f3a86 0%, #162D73 58%, #0c1226 100%)" }}>
            <div style={{ position: "absolute", left: "50%", top: "-10%", width: "60%", height: "120%", marginLeft: "-30%", background: "linear-gradient(180deg, rgba(211,235,254,0.26), transparent 70%)", filter: "blur(14px)", transform: "perspective(400px) rotateX(20deg)", transformOrigin: "top" }} />
            <div style={{ position: "absolute", left: "50%", bottom: "8%", width: 120, height: 220, marginLeft: -60, borderRadius: "60px 60px 40px 40px", background: "linear-gradient(180deg, #0a1230, #0c1740)", boxShadow: "0 0 40px rgba(0,0,0,0.6)" }} />
            <div style={v.flashStyle} />
            <div style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%,-50%)", width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              {logoImg}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero/logo.png" alt="Arka Ads Studio" style={{ position: "relative", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.55))" }} />
            </div>
            <div dir="ltr" style={{ position: "absolute", left: 20, bottom: 16, ...labelStyle }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>PHOTOGRAPHY</div>
              <div style={{ fontSize: 11, letterSpacing: "0.4em", color: "rgba(102,153,255,0.75)", marginTop: 6 }}>EDITORIAL &amp; STUDIO</div>
            </div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 14, boxShadow: "inset 0 0 60px rgba(102,153,255,0.22), inset 0 0 0 1px rgba(211,235,254,0.3)" }} />
          </div>
        </div>

        {/* ===== FINALE ===== */}
        <div style={v.leakStyle} />

        <div dir="ltr" style={v.logoStyle}>
          <div style={{ fontFamily: FONT_SERIF, fontWeight: 500, color: v.stage.logoColor, fontSize: "min(11vw,150px)", lineHeight: 0.95, letterSpacing: "0.02em", textShadow: v.stage.logoShadow }}>
            Arka Ads Studios
          </div>
        </div>
        <div dir="ltr" style={v.taglineStyle}>
          <span style={{ fontFamily: FONT_DISPLAY, letterSpacing: "0.55em", fontSize: 14, color: v.stage.taglineColor, textTransform: "uppercase" }}>
            Creative Studio &nbsp;·&nbsp; Production House
          </span>
        </div>
        <div dir="ltr" style={v.servicesStyle}>
          <div style={{ fontFamily: FONT_DISPLAY, letterSpacing: "0.32em", fontSize: 12, color: v.stage.servicesColor }}>FILM PRODUCTION</div>
          <div style={{ width: 1, height: 14, background: "rgba(166,201,255,0.4)" }} />
          <div style={{ fontFamily: FONT_DISPLAY, letterSpacing: "0.32em", fontSize: 12, color: v.stage.servicesColor }}>WEB DEVELOPMENT</div>
          <div style={{ width: 1, height: 14, background: "rgba(166,201,255,0.4)" }} />
          <div style={{ fontFamily: FONT_DISPLAY, letterSpacing: "0.32em", fontSize: 12, color: v.stage.servicesColor }}>PHOTOGRAPHY</div>
        </div>

        {/* Persian CTA — the actionable payoff, revealed last */}
        <div style={v.ctaStyle}>
          <span className="rounded-full border border-card-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-foreground-muted backdrop-blur">
            {content.heroBadge}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Magnetic strength={0.4}>
              <Button href="/contact" size="lg" variant="glow">
                {content.heroCtaLabel}
                <ArrowUpLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Magnetic>
            {onWatchReel && (
              <button onClick={onWatchReel} className="group inline-flex items-center gap-3 text-foreground">
                <span className="relative grid h-14 w-14 place-items-center rounded-full border border-card-border bg-surface/60 backdrop-blur transition-colors group-hover:border-primary">
                  <span className="absolute inset-0 animate-ping-slow rounded-full border border-primary/40" />
                  <Play className="h-5 w-5 translate-x-0.5 fill-current text-primary" />
                </span>
                <span className="text-sm font-medium">{content.heroReelLabel}</span>
              </button>
            )}
          </div>
        </div>

        {/* scroll hint */}
        <div style={v.hintStyle} hidden={v.hideHint}>
          <span style={{ fontFamily: FONT_DISPLAY, letterSpacing: "0.5em", fontSize: 11, color: v.stage.hintColor, textTransform: "uppercase" }}>
            {ui(locale).scrollToEnterHint}
          </span>
          <div style={{ width: 1, height: 34, margin: "14px auto 0", background: "linear-gradient(180deg, rgba(166,201,255,0.8), transparent)" }} />
        </div>

        {/* progress line */}
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 2, background: v.stage.progressGrad, zIndex: 60, width: v.progressWidth, boxShadow: v.stage.progressGlow }} />
      </div>
    </div>
  );
}
