import { PostEditor, emptyPost } from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return <PostEditor initial={emptyPost()} />;
}
