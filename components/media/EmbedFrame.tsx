// Thin iframe wrapper for embedded video platforms (Aparat/YouTube/Instagram).
// Kept as a tiny dedicated component so every call site renders embeds
// identically and safely (no inline style/attr drift).
export function EmbedFrame({
  src,
  className,
  title = "ویدیو",
}: {
  src: string;
  className?: string;
  title?: string;
}) {
  return (
    <iframe
      src={src}
      title={title}
      className={className}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      loading="lazy"
      style={{ border: 0 }}
    />
  );
}
