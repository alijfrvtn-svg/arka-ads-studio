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
  TrendingUp,
} from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatCard, Card, StatusBadge } from "@/components/admin/ui";
import { AreaChart, BarChart, Donut } from "@/components/admin/charts";
import { faDate, faNumber, toFa } from "@/lib/utils";

export default async function AdminDashboard() {
  const [projects, posts, leads, media, clients, topProjects] = await Promise.all([
    db.project.findMany({ select: { category: true, views: true } }),
    db.post.count(),
    db.lead.findMany({ orderBy: { createdAt: "desc" } }),
    db.media.count(),
    db.client.count(),
    db.project.findMany({
      orderBy: { views: "desc" },
      take: 5,
      include: { client: { select: { name: true } } },
    }),
  ]);

  const totalViews = projects.reduce((s, p) => s + p.views, 0);
  const newLeads = leads.filter((l) => l.status === "NEW").length;

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

  // projects by category → bar
  const catMap = new Map<string, number>();
  for (const p of projects) catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1);
  const catData = [...catMap.entries()].map(([label, value]) => ({ label, value }));

  // 12-week views trend (deterministic sample series)
  const trend = Array.from({ length: 12 }, (_, i) => {
    const base = totalViews / 12;
    return Math.round(base * (0.55 + 0.5 * Math.sin(i / 1.7) + i * 0.06));
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="داشبورد" description="نمای کلی عملکرد استودیو و کمپین‌ها">
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          پروژه جدید
        </Link>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="کل بازدید کمپین‌ها" value={faNumber(totalViews)} delta={12} icon={Eye} hint="نسبت به ماه قبل" />
        <StatCard label="سرنخ‌های جدید" value={newLeads} delta={8} icon={Inbox} hint="در انتظار پیگیری" />
        <StatCard label="پروژه‌های فعال" value={projects.length} delta={5} icon={FolderKanban} hint="منتشر شده" />
        <StatCard label="مطالب ژورنال" value={posts} icon={Newspaper} hint={`${toFa(media)} فایل رسانه`} />
      </div>

      {/* charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          title="روند بازدید کمپین‌ها"
          className="lg:col-span-2"
          action={<span className="flex items-center gap-1 text-xs font-medium text-emerald-400"><TrendingUp className="h-3.5 w-3.5" /> ۱۲ هفته اخیر</span>}
        >
          <AreaChart data={trend} />
          <div className="mt-3 flex justify-between px-1 text-[10px] text-foreground-faint">
            {["هفته ۱", "۳", "۵", "۷", "۹", "۱۲"].map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </Card>

        <Card title="سرنخ‌ها بر اساس وضعیت">
          <Donut
            segments={leadSegments}
            centerValue={toFa(leads.length)}
            centerLabel="کل سرنخ"
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
        </Card>

        <Card title="پروژه‌ها بر اساس دسته">
          <BarChart data={catData} />
        </Card>
      </div>

      {/* top projects + quick actions */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="پربازدیدترین پروژه‌ها" className="lg:col-span-2" bodyClassName="p-0">
          <div className="divide-y divide-card-border">
            {topProjects.map((p, i) => (
              <Link
                key={p.id}
                href={`/admin/portfolio/${p.id}`}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-card-hover"
              >
                <span className="w-5 font-display text-lg font-bold text-foreground-faint">{toFa(i + 1)}</span>
                <img src={p.cover} alt="" className="h-11 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="truncate text-xs text-foreground-muted">{p.client?.name}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-sm text-foreground-muted">
                  <Eye className="h-4 w-4" />
                  {faNumber(p.views)}
                </span>
              </Link>
            ))}
          </div>
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
        </Card>
      </div>
    </div>
  );
}
