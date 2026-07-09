import { Instagram, Linkedin, Youtube, Send, Play } from "lucide-react";

/** Maps a platform key to an icon (Aparat uses a custom mark). */
export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  switch (platform) {
    case "instagram":
      return <Instagram className={className} />;
    case "linkedin":
      return <Linkedin className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "telegram":
      return <Send className={className} />;
    case "aparat":
      return <Play className={className} />;
    default:
      return <Play className={className} />;
  }
}
