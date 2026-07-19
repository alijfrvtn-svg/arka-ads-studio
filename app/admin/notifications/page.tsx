import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { SendNotificationForm } from "@/components/admin/SendNotificationForm";
import { TestSmsButton } from "@/components/admin/TestSmsButton";

export default async function NotificationsPage() {
  const users = await db.user.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, role: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <PageHeader title="ارسال پیام" description="پیامی برای یک یا چند کاربر بفرست — تو زنگوله‌ی اعلان‌هاشون نمایش داده می‌شود" />
        <SendNotificationForm users={users} />
      </div>
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-foreground">تست پیامک</h2>
        <TestSmsButton />
      </div>
    </div>
  );
}
