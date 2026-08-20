import { Marquee } from "@/components/fx/Marquee";

/**
 * The client trust flow.
 *
 * ── Two things this had wrong ─────────────────────────────────────────────
 * **It showed the name, not the mark.** `Client` has carried a `logo` since the
 * schema was written and nothing ever read it, so a wall meant to be logos was
 * a wall of wordmarks. A logo is the whole point of this band: it is recognised
 * before it is read.
 *
 * **It showed everything twice.** `Marquee` renders its children twice by
 * design — that is what makes the loop seamless, and the second copy is
 * `aria-hidden` so it is announced once. With twenty clients the duplicate sits
 * off-screen and nobody sees it. With one, both copies are on screen at once,
 * side by side, and it reads as a bug because it looks exactly like one.
 *
 * So the row is repeated until it is long enough to overflow the track. That
 * fixes the visible duplicate at one client and changes nothing at twenty, and
 * it needs no judgement about how many is "enough" — the same rule covers both.
 */

export interface TrustClient {
  name: string;
  logo?: string | null;
}

/** Enough chips to overrun any sensible viewport before the loop repeats. */
const MIN_CHIPS = 10;

export function TrustMarquee({ clients, caption }: { clients: TrustClient[]; caption: string }) {
  const source = clients.length ? clients : [{ name: "برند", logo: null }];

  // Repeat rather than pad with blanks: a marquee of two real logos and eight
  // gaps is worse than a marquee of two logos going round.
  const row: TrustClient[] = [];
  while (row.length < MIN_CHIPS) row.push(...source);

  return (
    <div className="seam-top seam-bottom py-10">
      <p className="container-x mb-8 text-center text-[0.78rem] uppercase tracking-[0.18em] text-foreground-faint lg:text-[0.7rem] lg:tracking-[0.3em]">
        {caption}
      </p>
      <Marquee speed={38}>
        {row.map((c, i) => (
          <div
            key={i}
            className="liquid-clear mx-3 flex h-16 items-center justify-center rounded-2xl px-6 text-foreground-muted transition-colors duration-500 hover:text-foreground"
          >
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo}
                // The caption above already says these are clients, and the
                // name is not information a reader needs from each chip — an
                // alt on every repeat would have a screen reader list the same
                // brand ten times.
                alt=""
                loading="lazy"
                decoding="async"
                // Height fixed, width free: client logos arrive in every
                // proportion there is, and `contain` is what keeps a wide
                // wordmark and a square badge looking like one row.
                className="h-8 w-auto max-w-[9rem] object-contain"
              />
            ) : (
              <span className="whitespace-nowrap font-display text-lg font-bold">{c.name}</span>
            )}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
