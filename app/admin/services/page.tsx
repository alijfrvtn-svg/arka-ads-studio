import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";
import { Icon } from "@/components/ui/Icon";
import { deleteService, togglePublish } from "@/lib/actions";
import { DEPARTMENTS } from "@/lib/constants";
import { faNumber } from "@/lib/utils";

const deptLabel = (k: string) => DEPARTMENTS.find((d) => d.key === k)?.title ?? k;

export default async function ServicesList() {
  const services = await db.service.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { projects: true } } } });
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="خدمات" description={`${faNumber(services.length)} سرویس`}>
        <Link href="/admin/services/new" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> سرویس جدید
        </Link>
      </PageHeader>

      {services.length === 0 ? (
        <EmptyState icon={Sparkles} title="سرویسی وجود ندارد" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="flex flex-col rounded-2xl border border-card-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-card-border bg-background/50 text-primary">
                  <Icon name={s.icon} className="h-5 w-5" />
                </div>
                <StatusBadge status={s.published ? "PUBLISHED" : "DRAFT"} />
              </div>
              <h3 className="mt-4 font-display font-bold text-foreground">{s.title}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-foreground-muted">{s.excerpt}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-foreground-faint">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-primary">{deptLabel(s.department)}</span>
                <span>{faNumber(s._count.projects)} پروژه</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-card-border pt-3">
                <span className="text-xs text-foreground-muted ltr-nums">{s.priceFrom ? `از ${faNumber(s.priceFrom)}` : "—"}</span>
                <RowActions
                  editHref={`/admin/services/${s.id}`}
                  published={s.published}
                  togglePublishAction={togglePublish.bind(null, "service", s.id)}
                  deleteAction={deleteService.bind(null, s.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
