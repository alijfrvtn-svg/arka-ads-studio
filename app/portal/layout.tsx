import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: "پنل کاربران",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // Middleware guarantees only /portal/login reaches here unauthenticated.
  if (!user) return <>{children}</>;

  return (
    <PortalShell user={{ name: user.name, email: user.email, avatar: user.avatar }}>
      {children}
    </PortalShell>
  );
}
