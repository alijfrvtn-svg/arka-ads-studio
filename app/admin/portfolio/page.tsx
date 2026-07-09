import Link from "next/link";
import { Eye, Plus, Star } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";
import { deleteProject, togglePublish } from "@/lib/actions";
import { faNumber } from "@/lib/utils";
import { FolderKanban } from "lucide-react";

export default async function PortfolioList() {
  const projects = await db.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { client: { select: { name: true } }, _count: { select: { services: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="نمونه‌کارها" description={`${faNumber(projects.length)} پروژه`}>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> پروژه جدید
        </Link>
      </PageHeader>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="هنوز پروژه‌ای ثبت نشده"
          description="اولین کیس‌استادی خود را بسازید."
          action={
            <Link href="/admin/portfolio/new" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              ساخت پروژه
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-card-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-right text-xs text-foreground-faint">
                <th className="px-5 py-3 font-medium">پروژه</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">مشتری</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">دسته</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">بازدید</th>
                <th className="px-4 py-3 text-left font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {projects.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-card-hover">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt="" className="h-11 w-16 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/admin/portfolio/${p.id}`} className="truncate font-semibold text-foreground hover:text-primary">
                            {p.title}
                          </Link>
                          {p.featured && <Star className="h-3.5 w-3.5 fill-primary text-primary" />}
                        </div>
                        <p className="truncate text-xs text-foreground-faint">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-foreground-muted md:table-cell">{p.client?.name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-foreground-muted sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.published ? "PUBLISHED" : "DRAFT"} />
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="flex items-center gap-1.5 text-foreground-muted">
                      <Eye className="h-3.5 w-3.5" /> {faNumber(p.views)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      editHref={`/admin/portfolio/${p.id}`}
                      published={p.published}
                      togglePublishAction={togglePublish.bind(null, "project", p.id)}
                      deleteAction={deleteProject.bind(null, p.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
