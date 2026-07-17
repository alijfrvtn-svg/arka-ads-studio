import { PostEditor } from "@/components/admin/PostEditor";
import { emptyPost } from "@/lib/empty-content";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export default async function NewPostPage() {
  const [authors, sessionUser] = await Promise.all([
    db.user.findMany({ where: { role: { in: ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"] } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    getSessionUser(),
  ]);
  return <PostEditor initial={{ ...emptyPost(), authorId: sessionUser?.id }} authors={authors} />;
}
