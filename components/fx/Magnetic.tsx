"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery, FINE_POINTER } from "@/lib/use-media";

/**
 * Element that leans toward the cursor — cinematic magnetic hover.
 *
 * Inert without a cursor to lean toward, and that has to be said out loud
 * rather than left to `onMouseMove` never firing: a tap on a touchscreen
 * synthesises a mousemove at the point of contact before it sends the click,
 * so the button would jump out from under the finger that was pressing it and
 * stay there — there is no pointerleave coming to put it back.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const fine = useMediaQuery(FINE_POINTER);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={fine ? onMove : undefined}
      onMouseLeave={fine ? reset : undefined}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
