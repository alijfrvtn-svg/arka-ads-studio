import Link from "next/link";
import { Plus, Shield, CircleCheck, CircleAlert, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";
import { deleteUser } from "@/lib/actions";
import { ROLES } from "@/lib/constants";
import { faDate, faNumber } from "@/lib/utils";

const roleLabel = (r: string) => ROLES.find((x) => x.value === r)?.label ?? r;
// Standard Iranian mobile format after normalization: 09 + 9 digits.
const isValidPhone = (p: string) => /^09\d{9}$/.test(p);

export default async function UsersList() {
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="کاربران و نقش‌ها" description={`${faNumber(users.length)} کاربر · کنترل دسترسی نقش‌محور`}>
        <Link href="/admin/users/activity" className="inline-flex items-center gap-1.5 rounded-xl border border-card-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary">
          <Clock className="h-4 w-4" /> زمان فعالیت هفتگی
        </Link>
        <Link href="/admin/users/new" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> کاربر جدید
        </Link>
      </PageHeader>
      {users.length === 0 ? (
        <EmptyState icon={Shield} title="کاربری وجود ندارد" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-card-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-right text-xs text-foreground-faint">
                <th className="px-5 py-3 font-medium">کاربر</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">نقش</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">شماره موبایل</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">آخرین ورود</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">آخرین خروج</th>
                <th className="px-4 py-3 text-left font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-card-hover">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u.avatar || `https://i.pravatar.cc/80?u=${u.email}`} alt="" className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-foreground">{u.name}</p>
                        <p className="text-xs text-foreground-faint ltr-nums">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{roleLabel(u.role)}</span>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {u.phone ? (
                      <span className={`flex items-center gap-1.5 text-xs ltr-nums ${isValidPhone(u.phone) ? "text-foreground-muted" : "text-amber-500"}`}>
                        {isValidPhone(u.phone) ? <CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> : <CircleAlert className="h-3.5 w-3.5 shrink-0" />}
                        {u.phone}
                      </span>
                    ) : (
                      <span className="text-xs text-foreground-faint">ثبت نشده</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={u.active ? "PUBLISHED" : "DRAFT"} /></td>
                  <td className="hidden px-4 py-3 text-xs text-foreground-muted md:table-cell">
                    {u.lastLoginAt ? faDate(u.lastLoginAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-foreground-muted lg:table-cell">
                    {u.lastLogoutAt ? faDate(u.lastLogoutAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      editHref={`/admin/users/${u.id}`}
                      deleteAction={u.role === "SUPER_ADMIN" ? undefined : deleteUser.bind(null, u.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
