import Link from "next/link";
import { Plus, ListTodo } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { TasksBoard } from "@/components/admin/TasksBoard";
import { faNumber } from "@/lib/utils";

export default async function TasksPage() {
  const tasks = await db.task.findMany({
    include: {
      assignee: { select: { name: true, avatar: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  const open = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="تسک‌ها"
        description={`${faNumber(tasks.length)} تسک · ${faNumber(open)} باز — برای جابه‌جایی، کارت را بکشید`}
      >
        <Link
          href="/admin/tasks/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> تسک جدید
        </Link>
      </PageHeader>
      {tasks.length === 0 ? (
        <EmptyState icon={ListTodo} title="هنوز تسکی ثبت نشده" description="اولین تسک را برای یکی از اعضای تیم بساز." />
      ) : (
        <TasksBoard tasks={tasks} />
      )}
    </div>
  );
}
