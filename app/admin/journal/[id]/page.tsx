import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";
import { parseArr } from "@/lib/utils";
import type { PostInput } from "@/lib/actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();

  const authors = await db.user.findMany({
    where: { OR: [{ role: { in: ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"] } }, ...(post.authorId ? [{ id: post.authorId }] : [])] },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const initial: PostInput = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    titleEn: post.titleEn ?? "",
    titleAr: post.titleAr ?? "",
    excerpt: post.excerpt,
    excerptEn: post.excerptEn ?? "",
    excerptAr: post.excerptAr ?? "",
    cover: post.cover,
    authorId: post.authorId ?? undefined,
    content: post.content,
    contentEn: post.contentEn ?? "",
    contentAr: post.contentAr ?? "",
    category: post.category,
    categoryEn: post.categoryEn ?? "",
    categoryAr: post.categoryAr ?? "",
    tags: parseArr<string>(post.tags),
    tagsEn: parseArr<string>(post.tagsEn),
    tagsAr: parseArr<string>(post.tagsAr),
    featured: post.featured,
    published: post.published,
    readingMinutes: post.readingMinutes,
    metaTitle: post.metaTitle ?? "",
    metaTitleEn: post.metaTitleEn ?? "",
    metaTitleAr: post.metaTitleAr ?? "",
    metaDescription: post.metaDescription ?? "",
    metaDescriptionEn: post.metaDescriptionEn ?? "",
    metaDescriptionAr: post.metaDescriptionAr ?? "",
    ogImage: post.ogImage ?? "",
    keywords: parseArr<string>(post.keywords),
    keywordsEn: parseArr<string>(post.keywordsEn),
    keywordsAr: parseArr<string>(post.keywordsAr),
  };

  return <PostEditor initial={initial} authors={authors} />;
}
