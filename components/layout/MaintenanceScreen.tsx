import { Logo } from "@/components/brand/Logo";

export function MaintenanceScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <div className="mb-8 flex justify-center">
          <Logo tagline={false} />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          سایت موقتاً در حال تعمیر و نگهداری است
        </h1>
        <p className="mx-auto mt-4 max-w-md text-foreground-muted">
          به‌زودی برمی‌گردیم. از صبر شما سپاسگزاریم.
        </p>
      </div>
    </div>
  );
}
