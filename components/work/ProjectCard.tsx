import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, Play } from "lucide-react";
import { cn, parseArr } from "@/lib/utils";

interface CardProject {
  slug: string;
  title: string;
  category: string;
  cover: string;
  accent?: string;
  heroVideo?: string | null;
  tags?: string;
  client?: { name: string } | null;
}

export function ProjectCard({
  project,
  aspect = "aspect-[4/5]",
  priority = false,
  className,
}: {
  project: CardProject;
  aspect?: string;
  priority?: boolean;
  className?: string;
}) {
  const tags = parseArr<string>(project.tags).slice(0, 3);
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-card-border",
        className,
      )}
      data-cursor
    >
      <div className={cn("relative w-full overflow-hidden", aspect)}>
        <Image
          src={project.cover}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-95" />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(120% 80% at 50% 100%, ${project.accent ?? "#6699ff"}22, transparent)` }}
        />

        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {project.category}
        </span>
        {project.heroVideo && (
          <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur">
            <Play className="h-4 w-4 translate-x-0.5 fill-current" />
          </span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        {project.client?.name && (
          <p className="mb-1 text-xs text-white/60">{project.client.name}</p>
        )}
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-white">{project.title}</h3>
          <span className="grid h-9 w-9 shrink-0 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpLeft className="h-4 w-4" />
          </span>
        </div>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/70"
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
