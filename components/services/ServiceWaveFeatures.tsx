import { WaveList } from "@/components/ui/WaveList";
import type { Locale } from "@/types";

/**
 * The service feature list, on the wave.
 *
 * The wave itself moved to WaveList when the industry pages needed the same
 * thing; all that is left here is this section's own copy and the mapping from
 * a plain list of features to the shape it takes. Features are single lines,
 * so none of them carries a second half.
 */
const COPY: Record<Locale, { eyebrow: string; heading: string }> = {
  fa: { eyebrow: "ویژگی‌ها", heading: "چه چیزی تحویل می‌گیرید" },
  en: { eyebrow: "Features", heading: "What you get" },
  ar: { eyebrow: "المزايا", heading: "ما الذي تحصل عليه" },
};

export function ServiceWaveFeatures({
  features,
  locale = "fa",
}: {
  features: string[];
  locale?: Locale;
}) {
  const c = COPY[locale] ?? COPY.fa;
  return (
    <WaveList
      items={features.map((lead) => ({ lead }))}
      eyebrow={c.eyebrow}
      heading={c.heading}
      locale={locale}
    />
  );
}
