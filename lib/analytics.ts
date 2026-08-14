import { db } from "./db";

/**
 * Dashboard traffic figures, all derived from the PageView beacon.
 *
 * Every number here is measured. The dashboard previously showed a sine wave
 * for the trend and hardcoded `delta={12}` badges, so growth arrows moved
 * without any data behind them — worse than showing nothing, because they
 * looked authoritative.
 */

const DAY = 24 * 60 * 60 * 1000;

/** Percent change vs the preceding window of equal length. `null` when there is
 *  no prior data to compare against — the caller then shows no arrow at all
 *  rather than an infinite or meaningless "+100%". */
export function delta(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export interface TrafficSummary {
  views30: number;
  viewsPrev30: number;
  viewsDelta: number | null;
  clicks30: number;
  clicksPrev30: number;
  clicksDelta: number | null;
  /** Clicks as a share of views — the honest read of "how well the site converts". */
  ctr: number | null;
  totalViews: number;
  weekly: number[];
  weekLabels: string[];
  topPaths: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  topClicks: { label: string; count: number }[];
  hasData: boolean;
}

export async function getTrafficSummary(): Promise<TrafficSummary> {
  const now = Date.now();
  const from30 = new Date(now - 30 * DAY);
  const from60 = new Date(now - 60 * DAY);
  const from12w = new Date(now - 84 * DAY);

  const [recent, totalViews, prevViews, prevClicks] = await Promise.all([
    // One scan covers the trend, the top lists and the current window.
    db.pageView.findMany({
      where: { createdAt: { gte: from12w } },
      select: { path: true, kind: true, label: true, referrer: true, createdAt: true },
    }),
    db.pageView.count({ where: { kind: "VIEW" } }),
    db.pageView.count({ where: { kind: "VIEW", createdAt: { gte: from60, lt: from30 } } }),
    db.pageView.count({ where: { kind: "CLICK", createdAt: { gte: from60, lt: from30 } } }),
  ]);

  const in30 = recent.filter((r) => r.createdAt >= from30);
  const views30 = in30.filter((r) => r.kind === "VIEW").length;
  const clicks30 = in30.filter((r) => r.kind === "CLICK").length;

  // 12 weekly buckets, oldest → newest.
  const weekly = Array.from({ length: 12 }, () => 0);
  const weekLabels: string[] = [];
  for (let i = 0; i < 12; i++) {
    const start = now - (12 - i) * 7 * DAY;
    const end = start + 7 * DAY;
    weekly[i] = recent.filter(
      (r) => r.kind === "VIEW" && r.createdAt.getTime() >= start && r.createdAt.getTime() < end,
    ).length;
    weekLabels.push(String(i + 1));
  }

  const tally = <T extends string>(rows: (T | null)[]) => {
    const m = new Map<string, number>();
    for (const v of rows) if (v) m.set(v, (m.get(v) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  };

  return {
    views30,
    viewsPrev30: prevViews,
    viewsDelta: delta(views30, prevViews),
    clicks30,
    clicksPrev30: prevClicks,
    clicksDelta: delta(clicks30, prevClicks),
    ctr: views30 > 0 ? Math.round((clicks30 / views30) * 1000) / 10 : null,
    totalViews,
    weekly,
    weekLabels,
    topPaths: tally(in30.filter((r) => r.kind === "VIEW").map((r) => r.path)).map(([path, count]) => ({ path, count })),
    topReferrers: tally(in30.map((r) => r.referrer)).map(([referrer, count]) => ({ referrer, count })),
    topClicks: tally(in30.filter((r) => r.kind === "CLICK").map((r) => r.label)).map(([label, count]) => ({ label, count })),
    hasData: recent.length > 0,
  };
}
