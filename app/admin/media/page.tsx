import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { faNumber } from "@/lib/utils";

export default async function MediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="کتابخانه رسانه" description={`${faNumber(media.length)} فایل — تصویر و ویدیو`} />
      <MediaLibrary items={media} />
    </div>
  );
}
