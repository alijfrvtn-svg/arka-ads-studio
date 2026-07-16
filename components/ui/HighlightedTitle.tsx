/** Splits a title on its highlighted substring and wraps that part in the gradient accent span. */
export function HighlightedTitle({ title, highlight }: { title: string; highlight: string }) {
  const idx = highlight ? title.indexOf(highlight) : -1;
  if (idx === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, idx)}
      <span className="text-gradient">{highlight}</span>
      {title.slice(idx + highlight.length)}
    </>
  );
}
