import Link from "next/link";
import { Plus, Users2 } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";
import { deleteTeamMember } from "@/lib/actions";
import { faNumber } from "@/lib/utils";

export default async function TeamList() {
  const members = await db.teamMember.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="تیم" description={`${faNumber(members.length)} عضو — نمایش داده‌شده در صفحه‌ی درباره ما`}>
        <Link href="/admin/team/new" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> عضو جدید
        </Link>
      </PageHeader>
      {members.length === 0 ? (
        <EmptyState icon={Users2} title="عضوی ثبت نشده" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="rounded-2xl border border-card-border bg-surface p-5">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {m.avatar ? (
                  <img src={m.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 font-bold text-primary">{m.name.charAt(0)}</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{m.name}</p>
                  <p className="truncate text-xs text-foreground-muted">{m.role}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-card-border pt-3">
                <StatusBadge status={m.published ? "PUBLISHED" : "DRAFT"} />
                <RowActions editHref={`/admin/team/${m.id}`} deleteAction={deleteTeamMember.bind(null, m.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
