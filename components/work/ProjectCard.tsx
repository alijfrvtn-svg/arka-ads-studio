import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { tr, trArr } from "@/lib/i18n";
import type { Locale } from "@/types";
import { ProjectStatusDot } from "./ProjectStatusDot";

interface CardProject {
  slug: string;
  title: string;
  titleEn?: string | null;
  titleAr?: string | null;
  category: string;
  categoryEn?: string | null;
  categoryAr?: string | null;
  cover: string;
  accent?: string;
  heroVideo?: string | null;
  status?: string;
  tags?: string;
  tagsEn?: string | null;
  tagsAr?: string | null;
  client?: { name: string; nameEn?: string | null } | null;
}

export function ProjectCard({
  project,
  aspect = "aspect-[4/5]",
  priority = false,
  className,
  locale = "fa",
}: {
  project: CardProject;
  aspect?: string;
  priority?: boolean;
  className?: string;
  locale?: Locale;
}) {
  const title = tr(locale, project.title, project.titleEn, project.titleAr);
  const category = tr(locale, project.category, project.categoryEn, project.categoryAr);
  const tags = trArr<string>(locale, project.tags ?? "[]", project.tagsEn, project.tagsAr).slice(0, 3);
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-[1.5rem] border border-card-border transition-shadow duration-700 [transition-timing-function:var(--ease-apple)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_30px_70px_-34px_rgba(0,0,0,0.45)]",
        className,
      )}
      data-cursor
    >
      <div className={cn("relative w-full overflow-hidden", aspect)}>
        {/* Covers keep their own colour. The monochrome rule governs the
            interface, not the work shown inside it — this is an ad studio's
            portfolio, and desaturating it would be editing the product. */}
        <Image
          src={project.cover}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-[900ms] [transition-timing-function:var(--ease-apple)] group-hover:scale-[1.04]"
        />
        {/* Ink scrim, not page-background: the caption below is white, and on
            a white site a background-coloured scrim would erase it. The ramp
            stays near-opaque through the caption band so the title holds its
            contrast over any cover an admin uploads, bright ones included. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.86)_30%,rgba(0,0,0,0.34)_60%,rgba(0,0,0,0)_100%)] transition-opacity duration-700 group-hover:opacity-90" />

        <span className="glass-onmedia absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium">
          {category}
        </span>
        <ProjectStatusDot
          status={project.status ?? "DONE"}
          locale={locale}
          onMedia
          mono
          className="absolute bottom-4 right-4 z-10"
        />
        {project.heroVideo && (
          <span className="glass-onmedia absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full">
            <Play className="h-4 w-4 translate-x-0.5 fill-current" />
          </span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        {project.client?.name && (
          <p className="mb-1.5 text-xs text-white/60">{tr(locale, project.client.name, project.client.nameEn, project.client.nameEn)}</p>
        )}
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-xl font-bold tracking-tight text-white">{title}</h3>
          <span className="grid h-9 w-9 shrink-0 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-apple)] group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpLeft className="h-4 w-4" />
          </span>
        </div>
        {tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[0.72rem] lg:text-[11px] text-white/75 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
