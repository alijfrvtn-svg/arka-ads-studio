import Link from "next/link";
import { MessageSquareQuote, Plus, Star } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";
import { deleteTestimonial, togglePublish } from "@/lib/actions";
import { faNumber } from "@/lib/utils";

export default async function TestimonialsList() {
  const items = await db.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="نظرات مشتریان" description={`${faNumber(items.length)} نظر`}>
        <Link href="/admin/testimonials/new" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> نظر جدید
        </Link>
      </PageHeader>
      {items.length === 0 ? (
        <EmptyState icon={MessageSquareQuote} title="نظری ثبت نشده" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((t) => (
            <div key={t.id} className="rounded-2xl border border-card-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {t.avatar ? <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 font-bold text-primary">{t.author.charAt(0)}</div>}
                  <div>
                    <p className="font-semibold text-foreground">{t.author}</p>
                    <p className="text-xs text-foreground-muted">{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}</div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-foreground-muted">«{t.quote}»</p>
              <div className="mt-4 flex items-center justify-between border-t border-card-border pt-3">
                <StatusBadge status={t.published ? "PUBLISHED" : "DRAFT"} />
                <RowActions
                  editHref={`/admin/testimonials/${t.id}`}
                  published={t.published}
                  togglePublishAction={togglePublish.bind(null, "testimonial", t.id)}
                  deleteAction={deleteTestimonial.bind(null, t.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
