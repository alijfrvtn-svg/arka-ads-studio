import Link from "next/link";
import { Plus, Star, Users, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";
import { deleteClient } from "@/lib/actions";
import { faNumber } from "@/lib/utils";

export default async function ClientsList() {
  const clients = await db.client.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { projects: true } } } });
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="مشتریان (CRM)" description={`${faNumber(clients.length)} برند`}>
        <Link href="/admin/clients/new" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> مشتری جدید
        </Link>
      </PageHeader>
      {clients.length === 0 ? (
        <EmptyState icon={Users} title="مشتری‌ای ثبت نشده" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-card-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-right text-xs text-foreground-faint">
                <th className="px-5 py-3 font-medium">برند</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">صنعت</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">پروژه‌ها</th>
                <th className="px-4 py-3 text-left font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-card-hover">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {c.logo ? <img src={c.logo} alt="" className="h-10 w-10 rounded-lg border border-card-border object-cover" /> : <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 font-bold text-primary">{c.name.charAt(0)}</div>}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">{c.name}</span>
                          {c.featured && <Star className="h-3.5 w-3.5 fill-primary text-primary" />}
                        </div>
                        {c.nameEn && <span className="text-xs text-foreground-faint ltr-nums">{c.nameEn}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-foreground-muted sm:table-cell">{c.industry ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-foreground-muted md:table-cell">{faNumber(c._count.projects)}</td>
                  <td className="px-4 py-3">
                    <RowActions editHref={`/admin/clients/${c.id}`} deleteAction={deleteClient.bind(null, c.id)} />
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
