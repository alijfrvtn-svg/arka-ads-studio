import Link from "next/link";
import { Newspaper, Plus, Star, Clock, Eye } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";
import { CleanCitationsButton } from "@/components/admin/CleanCitationsButton";
import { deletePost, togglePublish } from "@/lib/actions";
import { faDate, faNumber, toFa } from "@/lib/utils";

export default async function JournalList() {
  const posts = await db.post.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="ژورنال" description={`${faNumber(posts.length)} مطلب`}>
        <CleanCitationsButton />
        <Link href="/admin/journal/new" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> مطلب جدید
        </Link>
      </PageHeader>

      {posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="هنوز مطلبی نیست" description="اولین مقاله ژورنال را بنویسید." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <div key={p.id} className="group overflow-hidden rounded-2xl border border-card-border bg-surface">
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute right-3 top-3 flex gap-1.5">
                  <StatusBadge status={p.published ? "PUBLISHED" : "DRAFT"} />
                  {p.featured && <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"><Star className="h-3 w-3 fill-current" /></span>}
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-primary">{p.category}</span>
                <h3 className="mt-1 line-clamp-2 font-display font-bold text-foreground">{p.title}</h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-foreground-faint">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {toFa(p.readingMinutes)} دقیقه</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {faNumber(p.views)}</span>
                  <span>{faDate(p.publishedAt, { month: "short", day: "numeric" })}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-card-border pt-3">
                  <span className="text-xs text-foreground-muted">{p.author?.name}</span>
                  <RowActions
                    editHref={`/admin/journal/${p.id}`}
                    published={p.published}
                    togglePublishAction={togglePublish.bind(null, "post", p.id)}
                    deleteAction={deletePost.bind(null, p.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
