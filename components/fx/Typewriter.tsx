"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Types `text` out one character at a time, restarting whenever `runKey`
 * changes (the hero passes the slide index, so every slide change retypes).
 *
 * Two things this does that a naive setInterval version does not:
 *
 *  - Reserves the final height up front. A line that types into an empty box
 *    grows as it fills, shoving everything below it down the page; the finished
 *    string is rendered invisibly underneath so the box is full-size from frame
 *    one and nothing reflows.
 *  - Honours prefers-reduced-motion by showing the whole string immediately.
 *    A character-by-character reveal is exactly the kind of animated text that
 *    setting exists to stop.
 *
 * The visible text is aria-hidden and the real string sits in the sizing copy,
 * so a screen reader hears the sentence once, whole, instead of 40 partial
 * updates.
 */
export function Typewriter({
  text,
  runKey,
  speed = 26,
  startDelay = 0,
  className,
  as: Tag = "span",
}: {
  text: string;
  runKey: string | number;
  /** Milliseconds per character. */
  speed?: number;
  startDelay?: number;
  className?: string;
  as?: "span" | "p" | "h1" | "h2";
}) {
  const [shown, setShown] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text.length);
      return;
    }

    setShown(0);
    const begin = window.setTimeout(() => {
      let i = 0;
      const tick = () => {
        i += 1;
        setShown(i);
        if (i < text.length) timers.current.push(window.setTimeout(tick, speed));
      };
      timers.current.push(window.setTimeout(tick, speed));
    }, startDelay);
    timers.current.push(begin);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [text, runKey, speed, startDelay]);

  const done = shown >= text.length;

  return (
    <Tag className={className} style={{ position: "relative", display: "block" }}>
      {/* Sizing copy: invisible, unclickable, but occupies the final box — and
          it is the version assistive tech reads. */}
      <span style={{ visibility: "hidden" }}>{text}</span>
      <span
        aria-hidden
        style={{ position: "absolute", inset: 0 }}
      >
        {text.slice(0, shown)}
        {!done && (
          <span
            style={{
              display: "inline-block",
              width: "0.06em",
              height: "1em",
              marginInlineStart: "0.06em",
              background: "currentColor",
              verticalAlign: "-0.1em",
              animation: "eoc-cursor 1s step-end infinite",
            }}
          />
        )}
      </span>
    </Tag>
  );
}
