import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Textarea, Select, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { CommentThread } from "@/components/tasks/CommentThread";
import { saveTask, addTaskComment } from "@/lib/actions";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/constants";
import { DeleteTaskButton } from "./DeleteTaskButton";

const toInputDate = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");

export default async function TaskForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const task = isNew
    ? null
    : await db.task.findUnique({
        where: { id },
        include: {
          comments: {
            include: { author: { select: { name: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
      });
  if (!isNew && !task) notFound();

  const users = await db.user.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/tasks"
          className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">{isNew ? "تسک جدید" : "ویرایش تسک"}</h1>
      </div>

      <form action={saveTask} className="space-y-5">
        {!isNew && <input type="hidden" name="id" value={task!.id} />}
        <FormSection title="اطلاعات تسک">
          <Field label="عنوان" required>
            <Input name="title" defaultValue={task?.title} required />
          </Field>
          <Field label="توضیحات">
            <Textarea name="description" defaultValue={task?.description ?? ""} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="مسئول" required>
              <Select name="assigneeId" defaultValue={task?.assigneeId ?? ""} required>
                <option value="" disabled>
                  انتخاب کنید
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="سررسید">
              <Input name="dueDate" type="date" defaultValue={toInputDate(task?.dueDate)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="وضعیت">
              <Select name="status" defaultValue={task?.status ?? "TODO"}>
                {TASK_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="اولویت">
              <Select name="priority" defaultValue={task?.priority ?? "MEDIUM"}>
                {TASK_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </FormSection>

        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
          {!isNew ? <DeleteTaskButton id={task!.id} /> : <span />}
          <SubmitButton>ذخیره تسک</SubmitButton>
        </div>
      </form>

      {!isNew && task && (
        <div className="mt-8">
          <CommentThread taskId={task.id} comments={task.comments} addComment={addTaskComment} />
        </div>
      )}
    </div>
  );
}
