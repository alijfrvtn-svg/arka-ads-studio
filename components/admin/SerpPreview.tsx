import { cn } from "@/lib/utils";

/** Google-style SERP snippet preview with length guidance. */
export function SerpPreview({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const t = title || "عنوان صفحه — همینجا نمایش داده می‌شود";
  const d = description || "توضیح متا صفحه در نتایج جستجو اینجا نشان داده می‌شود. یک توضیح جذاب بنویسید.";
  const titleWarn = title.length > 60;
  const descWarn = description.length > 160;
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-card-border bg-white p-4 dark:bg-[#0b1020]">
        <div className="flex items-center gap-2 text-xs text-[#4d5156] dark:text-foreground-faint">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f1f3f4] text-[10px] dark:bg-surface-2">آ</span>
          <div className="ltr-nums text-left" dir="ltr">
            <div className="text-[#202124] dark:text-foreground">ARKA</div>
            <div className="text-[#4d5156] dark:text-foreground-faint">arka.studio › {path.replace(/^\//, "")}</div>
          </div>
        </div>
        <h3 className="mt-1 truncate text-xl text-[#1a0dab] dark:text-sky">{t}</h3>
        <p className="mt-0.5 line-clamp-2 text-sm text-[#4d5156] dark:text-foreground-muted">{d}</p>
      </div>
      <div className="flex justify-between px-1 text-[11px]">
        <span className={cn(titleWarn ? "text-rose-400" : "text-foreground-faint")}>
          عنوان: {title.length}/۶۰
        </span>
        <span className={cn(descWarn ? "text-rose-400" : "text-foreground-faint")}>
          توضیح: {description.length}/۱۶۰
        </span>
      </div>
    </div>
  );
}
