import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { effectivePermissions } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { parseArr } from "@/lib/utils";
import type { Role } from "@/types";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // Middleware guarantees only /admin/login reaches here unauthenticated.
  if (!user) return <>{children}</>;

  const overrides = parseArr<string>(user.permissions);
  const effective = effectivePermissions(user.role as Role, overrides);
  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <AdminShell
      user={{ name: user.name, email: user.email, role: user.role as Role, avatar: user.avatar }}
      effective={effective}
      notifications={notifications}
    >
      {children}
    </AdminShell>
  );
}
