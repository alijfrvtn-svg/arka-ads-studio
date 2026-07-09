import { PostEditor } from "@/components/admin/PostEditor";
import { emptyPost } from "@/lib/empty-content";

export default function NewPostPage() {
  return <PostEditor initial={emptyPost()} />;
}
