import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";
import { Icon } from "@/components/ui/Icon";
import { deleteIndustry, togglePublish } from "@/lib/actions";
import { faNumber } from "@/lib/utils";

export default async function IndustriesList() {
  const industries = await db.industry.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { projects: true } } } });
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="صنایع" description={`${faNumber(industries.length)} صنعت`}>
        <Link href="/admin/industries/new" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> صنعت جدید
        </Link>
      </PageHeader>
      {industries.length === 0 ? (
        <EmptyState icon={Building2} title="صنعتی ثبت نشده" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <div key={ind.id} className="flex items-center gap-3 rounded-2xl border border-card-border bg-surface p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-card-border bg-background/50 text-primary">
                <Icon name={ind.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">{ind.title}</p>
                <p className="text-xs text-foreground-faint">{faNumber(ind._count.projects)} پروژه</p>
              </div>
              <RowActions
                editHref={`/admin/industries/${ind.id}`}
                published={ind.published}
                togglePublishAction={togglePublish.bind(null, "industry", ind.id)}
                deleteAction={deleteIndustry.bind(null, ind.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
