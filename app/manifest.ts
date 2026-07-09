import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.nameEn} — ${SITE.positioning}`,
    short_name: SITE.nameEn,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#04060d",
    theme_color: "#6699ff",
    dir: "rtl",
    lang: "fa",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
