import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";
import { parseArr } from "@/lib/utils";
import type { PostInput } from "@/lib/actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();

  const initial: PostInput = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    cover: post.cover,
    content: post.content,
    category: post.category,
    tags: parseArr<string>(post.tags),
    featured: post.featured,
    published: post.published,
    readingMinutes: post.readingMinutes,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    ogImage: post.ogImage ?? "",
    keywords: parseArr<string>(post.keywords),
  };

  return <PostEditor initial={initial} />;
}
