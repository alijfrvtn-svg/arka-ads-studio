import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { PortalShell } from "@/components/portal/PortalShell";
import { db } from "@/lib/db";

/**
 * Never prerender the staff portal.
 *
 * Every page under here is behind auth and shows data for the signed-in user,
 * so a build-time snapshot is meaningless. It also made deploys depend on the
 * database being reachable at build time: a blip while Next was prerendering
 * /admin/services failed the entire build, taking the public site down with it
 * for that deploy.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پنل کاربران",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // Middleware guarantees only /portal/login reaches here unauthenticated.
  if (!user) return <>{children}</>;

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <PortalShell user={{ name: user.name, email: user.email, avatar: user.avatar }} notifications={notifications}>
      {children}
    </PortalShell>
  );
}
