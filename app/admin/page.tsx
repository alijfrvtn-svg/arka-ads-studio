import Link from "next/link";
import {
  Eye,
  Inbox,
  FolderKanban,
  Newspaper,
  Plus,
  ArrowUpLeft,
  Users,
  Image as ImageIcon,
  MousePointerClick,
  TrendingUp,
  Globe,
} from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatCard, Card, StatusBadge, EmptyState } from "@/components/admin/ui";
import { AreaChart, BarChart, Donut } from "@/components/admin/charts";
import { ProjectStatusDot } from "@/components/work/ProjectStatusDot";
import { getTrafficSummary, delta } from "@/lib/analytics";
import { PROJECT_STATUSES } from "@/lib/constants";
import { faDate, faNumber, toFa } from "@/lib/utils";

const DAY = 24 * 60 * 60 * 1000;

export default async function AdminDashboard() {
  const now = Date.now();
  const from30 = new Date(now - 30 * DAY);
  const from60 = new Date(now - 60 * DAY);

  const [projects, posts, leads, media, traffic, topProjects] = await Promise.all([
    db.project.findMany({ select: { category: true, views: true, status: true, published: true } }),
    db.post.count(),
    db.lead.findMany({ orderBy: { createdAt: "desc" } }),
    db.media.count(),
    getTrafficSummary(),
    db.project.findMany({
      orderBy: { views: "desc" },
      take: 5,
      include: { client: { select: { name: true } } },
    }),
  ]);

  const newLeads = leads.filter((l) => l.status === "NEW").length;
  // Real month-over-month movement instead of the hardcoded badges this page
  // used to show.
  const leads30 = leads.filter((l) => l.createdAt >= from30).length;
  const leadsPrev30 = leads.filter((l) => l.createdAt >= from60 && l.createdAt < from30).length;

  const published = projects.filter((p) => p.published);
  const inProgress = published.filter((p) => p.status === "IN_PROGRESS").length;
  const done = published.length - inProgress;

  // leads by status → donut
  const statusColors: Record<string, string> = {
    NEW: "#6699ff",
    CONTACTED: "#f59e0b",
    PROPOSAL: "#a6c9ff",
    WON: "#34d399",
    LOST: "#fb7185",
  };
  const statusLabels: Record<string, string> = {
    NEW: "جدید",
    CONTACTED: "تماس گرفته",
    PROPOSAL: "پیشنهاد",
    WON: "برنده",
    LOST: "از دست رفته",
  };
  const leadSegments = Object.keys(statusColors)
    .map((k) => ({
      label: statusLabels[k],
      value: leads.filter((l) => l.status === k).length,
      color: statusColors[k],
    }))
    .filter((s) => s.value > 0);

  const catMap = new Map<string, number>();
  for (const p of projects) catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1);
  const catData = [...catMap.entries()].map(([label, value]) => ({ label, value }));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="داشبورد" description="آمار واقعی بازدید سایت و عملکرد استودیو">
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          پروژه جدید
        </Link>
      </PageHeader>

      {/* KPIs — every figure below is measured, not estimated */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="بازدید سایت (۳۰ روز)"
          value={faNumber(traffic.views30)}
          delta={traffic.viewsDelta}
          icon={Eye}
          hint={`${toFa(traffic.totalViews)} بازدید از ابتدا`}
        />
        <StatCard
          label="کلیک روی دکمه‌ها (۳۰ روز)"
          value={faNumber(traffic.clicks30)}
          delta={traffic.clicksDelta}
          icon={MousePointerClick}
          hint={traffic.ctr !== null ? `نرخ کلیک ${toFa(traffic.ctr)}٪` : "در انتظار داده"}
        />
        <StatCard
          label="سرنخ‌های جدید"
          value={newLeads}
          delta={delta(leads30, leadsPrev30)}
          icon={Inbox}
          hint={`${toFa(leads.length)} سرنخ در مجموع`}
        />
        <StatCard
          label="پروژه‌های منتشرشده"
          value={published.length}
          icon={FolderKanban}
          hint={`${toFa(done)} انجام‌شده · ${toFa(inProgress)} در حال اجرا`}
        />
      </div>

      {!traffic.hasData && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <Globe className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">هنوز داده‌ی بازدیدی ثبت نشده</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
              آمار بازدید از لحظه‌ی انتشار همین نسخه شروع به جمع‌آوری می‌شود؛ چند ساعت بعد از دیپلوی
              نمودارها پر می‌شوند. هیچ اطلاعات شخصی‌ای از بازدیدکننده ذخیره نمی‌شود — فقط آدرس صفحه،
              منبع ورود و زمان.
            </p>
          </div>
        </div>
      )}

      {/* charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          title="روند بازدید سایت"
          className="lg:col-span-2"
          action={
            <span className="flex items-center gap-1 text-xs font-medium text-foreground-muted">
              <TrendingUp className="h-3.5 w-3.5" /> ۱۲ هفته اخیر
            </span>
          }
        >
          <AreaChart data={traffic.weekly} />
          <div className="mt-3 flex justify-between px-1 text-[10px] text-foreground-faint">
            {["هفته ۱", "۳", "۵", "۷", "۹", "۱۲"].map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </Card>

        <Card title="سرنخ‌ها بر اساس وضعیت">
          {leadSegments.length ? (
            <Donut segments={leadSegments} centerValue={toFa(leads.length)} centerLabel="کل سرنخ" />
          ) : (
            <EmptyState icon={Inbox} title="سرنخی ثبت نشده" />
          )}
        </Card>
      </div>

      {/* traffic detail */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="پربازدیدترین صفحه‌ها" bodyClassName="p-0">
          <TrafficList
            rows={traffic.topPaths.map((r) => ({ label: r.path, count: r.count }))}
            empty="هنوز بازدیدی ثبت نشده"
            ltr
          />
        </Card>
        <Card title="از کجا آمده‌اند" bodyClassName="p-0">
          <TrafficList
            rows={traffic.topReferrers.map((r) => ({ label: r.referrer, count: r.count }))}
            empty="ورود مستقیم — منبع بیرونی ثبت نشده"
            ltr
          />
        </Card>
        <Card title="پرکلیک‌ترین دکمه‌ها" bodyClassName="p-0">
          <TrafficList
            rows={traffic.topClicks.map((r) => ({ label: r.label, count: r.count }))}
            empty="هنوز کلیکی ثبت نشده"
          />
        </Card>
      </div>

      {/* tables + bar */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          title="آخرین سرنخ‌ها"
          className="lg:col-span-2"
          action={
            <Link href="/admin/leads" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              همه <ArrowUpLeft className="h-3.5 w-3.5" />
            </Link>
          }
          bodyClassName="p-0"
        >
          {leads.length === 0 ? (
            <EmptyState icon={Inbox} title="سرنخی ثبت نشده" />
          ) : (
            <div className="divide-y divide-card-border">
              {leads.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                    {l.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{l.name}</p>
                    <p className="truncate text-xs text-foreground-muted">{l.service}</p>
                  </div>
                  <StatusBadge status={l.status} />
                  <span className="hidden shrink-0 text-xs text-foreground-faint sm:block">
                    {faDate(l.createdAt, { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="پروژه‌ها بر اساس دسته">
          {catData.length ? <BarChart data={catData} /> : <EmptyState icon={FolderKanban} title="پروژه‌ای ثبت نشده" />}
        </Card>
      </div>

      {/* top projects + quick actions */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="پربازدیدترین پروژه‌ها" className="lg:col-span-2" bodyClassName="p-0">
          {topProjects.length === 0 ? (
            <EmptyState icon={FolderKanban} title="پروژه‌ای ثبت نشده" />
          ) : (
            <div className="divide-y divide-card-border">
              {topProjects.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/admin/portfolio/${p.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-card-hover sm:gap-4 sm:px-5"
                >
                  <span className="w-5 shrink-0 font-display text-lg font-bold text-foreground-faint">{toFa(i + 1)}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt="" className="hidden h-11 w-16 shrink-0 rounded-lg object-cover sm:block" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{p.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <ProjectStatusDot status={p.status} />
                      {p.client?.name && (
                        <span className="truncate text-xs text-foreground-muted">{p.client.name}</span>
                      )}
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 text-sm text-foreground-muted">
                    <Eye className="h-4 w-4" />
                    {faNumber(p.views)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card title="دسترسی سریع">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "پروژه جدید", href: "/admin/portfolio/new", icon: FolderKanban },
              { label: "مطلب جدید", href: "/admin/journal/new", icon: Newspaper },
              { label: "رسانه", href: "/admin/media", icon: ImageIcon },
              { label: "مشتریان", href: "/admin/clients", icon: Users },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-background/40 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <a.icon className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-foreground">{a.label}</span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-foreground-faint">
            آمار بازدید بدون کوکی و بدون ذخیره‌ی IP جمع‌آوری می‌شود و درخواست Do Not Track مرورگر
            رعایت می‌شود.
          </p>
        </Card>
      </div>

      <p className="mt-4 text-center text-[11px] text-foreground-faint">
        {toFa(posts)} مطلب ژورنال · {toFa(media)} فایل رسانه ·{" "}
        {PROJECT_STATUSES.map((s) => s.label).join(" / ")} در صفحه نمونه‌کارها قابل فیلتر است
      </p>
    </div>
  );
}

/** Ranked list with a proportional bar — used by the three traffic cards. */
function TrafficList({
  rows,
  empty,
  ltr = false,
}: {
  rows: { label: string; count: number }[];
  empty: string;
  ltr?: boolean;
}) {
  if (!rows.length) {
    return <p className="px-5 py-8 text-center text-xs text-foreground-faint">{empty}</p>;
  }
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <div className="divide-y divide-card-border">
      {rows.map((r) => (
        <div key={r.label} className="px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`min-w-0 flex-1 truncate text-xs text-foreground ${ltr ? "ltr-nums text-left" : ""}`}
              dir={ltr ? "ltr" : undefined}
              title={r.label}
            >
              {r.label}
            </span>
            <span className="shrink-0 text-xs font-semibold text-foreground-muted">{toFa(r.count)}</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-card-border">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
