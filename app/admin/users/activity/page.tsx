import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronLeft, Clock3 } from "lucide-react";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/admin/ui";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { jalaliWeekRange, gregorianToJalali, JALALI_MONTHS } from "@/lib/jalali";
import { toFa, faDate } from "@/lib/utils";

const rawStamp = (d: Date) => faDate(d, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

const SESSION_CAP_MS = 12 * 60 * 60 * 1000; // caps one login's counted length — a forgotten-open tab shouldn't look like 3 days of "activity"

function effectiveSessionEnd(loginAt: Date, logoutAt: Date | null, now: Date) {
  const capEnd = new Date(loginAt.getTime() + SESSION_CAP_MS);
  const realEnd = logoutAt ?? now;
  return realEnd < capEnd ? realEnd : capEnd;
}

function weekOverlapMs(loginAt: Date, logoutAt: Date | null, rangeStart: Date, rangeEnd: Date, now: Date) {
  const end = effectiveSessionEnd(loginAt, logoutAt, now);
  const clippedStart = loginAt < rangeStart ? rangeStart : loginAt;
  const clippedEnd = end > rangeEnd ? rangeEnd : end;
  return Math.max(clippedEnd.getTime() - clippedStart.getTime(), 0);
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0 && m === 0) return "۰ دقیقه";
  if (h === 0) return `${toFa(m)} دقیقه`;
  if (m === 0) return `${toFa(h)} ساعت`;
  return `${toFa(h)} ساعت و ${toFa(m)} دقیقه`;
}

function formatRangeLabel(start: Date) {
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  const s = gregorianToJalali(start);
  const e = gregorianToJalali(end);
  if (s.jm === e.jm) return `${toFa(s.jd)} تا ${toFa(e.jd)} ${JALALI_MONTHS[e.jm - 1]} ${toFa(e.jy)}`;
  return `${toFa(s.jd)} ${JALALI_MONTHS[s.jm - 1]} تا ${toFa(e.jd)} ${JALALI_MONTHS[e.jm - 1]} ${toFa(e.jy)}`;
}

export default async function UserActivityPage({ searchParams }: { searchParams: Promise<{ weekStart?: string }> }) {
  const sp = await searchParams;
  const { start: rangeStart, end: rangeEnd } = sp.weekStart ? jalaliWeekRange(new Date(sp.weekStart)) : jalaliWeekRange();
  const now = new Date();

  const [users, sessions, recentSessions] = await Promise.all([
    db.user.findMany({ where: { active: true }, select: { id: true, name: true, avatar: true, email: true }, orderBy: { name: "asc" } }),
    db.sessionLog.findMany({
      where: { loginAt: { lt: rangeEnd }, OR: [{ logoutAt: null }, { logoutAt: { gt: rangeStart } }] },
      select: { userId: true, loginAt: true, logoutAt: true },
    }),
    db.sessionLog.findMany({
      orderBy: { loginAt: "desc" },
      take: 30,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const totals = new Map<string, number>();
  for (const s of sessions) {
    const ms = weekOverlapMs(s.loginAt, s.logoutAt, rangeStart, rangeEnd, now);
    totals.set(s.userId, (totals.get(s.userId) ?? 0) + ms);
  }

  const rows = users
    .map((u) => ({ ...u, ms: totals.get(u.id) ?? 0 }))
    .sort((a, b) => b.ms - a.ms);
  const maxMs = Math.max(...rows.map((r) => r.ms), 1);

  const prevWeek = new Date(rangeStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const nextWeek = new Date(rangeStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-3xl">
      <AutoRefresh />
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/users" className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">زمان فعالیت هفتگی</h1>
      </div>
      <p className="mb-5 text-sm text-foreground-muted">
        مجموع زمان ورود-تا-خروج هر کاربر تو این هفته — نه لزوماً فعالیت پیوسته، چون فقط ورود/خروج ثبت می‌شه
      </p>

      <div className="mb-5 flex items-center justify-between rounded-2xl border border-card-border bg-surface p-4">
        <Link href={`/admin/users/activity?weekStart=${toISO(prevWeek)}`} className="grid h-9 w-9 place-items-center rounded-lg border border-card-border text-foreground-muted hover:text-primary">
          <ChevronRight className="h-4 w-4" />
        </Link>
        <span className="text-sm font-semibold text-foreground">{formatRangeLabel(rangeStart)}</span>
        <Link href={`/admin/users/activity?weekStart=${toISO(nextWeek)}`} className="grid h-9 w-9 place-items-center rounded-lg border border-card-border text-foreground-muted hover:text-primary">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={Clock3} title="کاربری وجود ندارد" />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-card-border bg-surface p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.avatar || `https://i.pravatar.cc/80?u=${r.email}`} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <span className="text-sm font-semibold text-foreground">{r.name}</span>
                </div>
                <span className="text-sm font-semibold text-primary ltr-nums">{formatDuration(r.ms)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(r.ms / maxMs) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">لاگ خام (۳۰ ورود اخیر — برای عیب‌یابی)</h2>
        {recentSessions.length === 0 ? (
          <p className="text-sm text-foreground-faint">هنوز هیچ ورودی ثبت نشده.</p>
        ) : (
          <div className="overflow-hidden overflow-x-auto rounded-2xl border border-card-border bg-surface">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-card-border text-right text-foreground-faint">
                  <th className="px-4 py-2.5 font-medium">کاربر</th>
                  <th className="px-4 py-2.5 font-medium">ورود</th>
                  <th className="px-4 py-2.5 font-medium">خروج</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {recentSessions.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2.5 text-foreground">{s.user.name}</td>
                    <td className="px-4 py-2.5 text-foreground-muted ltr-nums">{rawStamp(s.loginAt)}</td>
                    <td className="px-4 py-2.5 ltr-nums">
                      {s.logoutAt ? (
                        <span className="text-foreground-muted">{rawStamp(s.logoutAt)}</span>
                      ) : (
                        <span className="font-semibold text-amber-500">باز (هنوز خارج نشده)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
