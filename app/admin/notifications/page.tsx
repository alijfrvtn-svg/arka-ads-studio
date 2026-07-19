import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { SendNotificationForm } from "@/components/admin/SendNotificationForm";

export default async function NotificationsPage() {
  const users = await db.user.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, role: true },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="ارسال پیام" description="پیامی برای یک یا چند کاربر بفرست — تو زنگوله‌ی اعلان‌هاشون نمایش داده می‌شود" />
      <SendNotificationForm users={users} />
    </div>
  );
}
