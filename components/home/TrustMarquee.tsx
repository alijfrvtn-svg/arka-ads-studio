import { Marquee } from "@/components/fx/Marquee";
import { LogoMark } from "@/components/brand/Logo";

/** Infinite client-logo trust flow (styled wordmark chips). */
export function TrustMarquee({
  clients,
  caption,
}: {
  clients: { name: string }[];
  caption: string;
}) {
  const row = clients.length ? clients : [{ name: "برند" }];
  return (
    <div className="border-y border-card-border bg-surface-2 py-10">
      <p className="container-x mb-8 text-center text-[0.7rem] uppercase tracking-[0.3em] text-foreground-faint">
        {caption}
      </p>
      <Marquee speed={38}>
        {row.map((c, i) => (
          <div
            key={i}
            className="liquid-clear mx-3 flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-foreground-muted transition-colors duration-500 hover:text-foreground"
          >
            <LogoMark mono className="h-5 w-5 opacity-70" />
            <span className="whitespace-nowrap font-display text-lg font-bold">{c.name}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
