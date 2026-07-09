import { cn, toFa } from "@/lib/utils";

/** Lightweight dependency-free SVG charts (time axis kept LTR by convention). */

export function AreaChart({
  data,
  height = 170,
  className,
  id = "area",
}: {
  data: number[];
  height?: number;
  className?: string;
  id?: string;
}) {
  const w = 640;
  const h = height;
  const pad = 8;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1 || 1)) * (w - pad * 2) + pad,
    h - pad - ((v - min) / span) * (h - pad * 2),
  ]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L ${pts[pts.length - 1][0].toFixed(1)} ${h} L ${pts[0][0].toFixed(1)} ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${id})`} />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="var(--primary)" />
      ))}
    </svg>
  );
}

export function BarChart({
  data,
  className,
  height = 180,
}: {
  data: { label: string; value: number }[];
  className?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cn("flex items-end justify-between gap-2", className)} style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-primary transition-all duration-500 hover:from-primary hover:to-accent"
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="truncate text-[10px] text-foreground-faint">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  segments,
  size = 168,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={c} cy={c} r={r} fill="none" stroke="var(--card-border)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const dash = (s.value / total) * circ;
            const el = (
              <circle
                key={i}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-extrabold text-foreground">{centerValue}</span>
          {centerLabel && <span className="text-xs text-foreground-faint">{centerLabel}</span>}
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-foreground-muted">{s.label}</span>
            <span className="mr-auto font-semibold text-foreground">{toFa(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
