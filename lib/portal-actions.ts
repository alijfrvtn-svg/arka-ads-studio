"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { requireUser } from "./auth";

/**
 * پنل کاربران (/portal) — پرسنل فقط روی تسک‌های خودشون می‌تونن عمل کنن، نه با
 * سیستم RBAC پنل مدیریت. assigneeId همیشه سمت سرور از سشن کاربر تأیید می‌شه،
 * نه از ورودی کلاینت.
 */
async function requireOwnTask(taskId: string) {
  const user = await requireUser();
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task || task.assigneeId !== user.id) throw new Error("FORBIDDEN");
  return { user, task };
}

export async function updateMyTaskStatus(taskId: string, status: string) {
  await requireOwnTask(taskId);
  await db.task.update({
    where: { id: taskId },
    data: { status, completedAt: status === "DONE" ? new Date() : null },
  });
  revalidatePath("/portal");
  revalidatePath(`/portal/tasks/${taskId}`);
  return { ok: true };
}

export async function addMyTaskComment(taskId: string, body: string) {
  const { user } = await requireOwnTask(taskId);
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "متن یادداشت خالی است" };
  await db.taskComment.create({ data: { taskId, authorId: user.id, body: trimmed } });
  revalidatePath(`/portal/tasks/${taskId}`);
  return { ok: true };
}
