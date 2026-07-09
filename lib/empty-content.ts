// Default/blank objects for "create new" admin forms (Post/Project editors).
// Deliberately NOT inside a "use client" file: the /admin/*/new Server
// Component pages call these directly while rendering, and a plain function
// exported from a "use client" module cannot be invoked on the server
// (Next.js treats every export of a client file as a client-only reference).
import type { PostInput } from "./actions";
import type { ProjectInput } from "./actions";

export function emptyPost(): PostInput {
  return {
    slug: "",
    title: "",
    excerpt: "",
    cover: "https://picsum.photos/seed/new-post/1600/900",
    content: "## مقدمه\n\nمتن مطلب را اینجا بنویسید…",
    category: "استراتژی برند",
    tags: [],
    featured: false,
    published: true,
    readingMinutes: 3,
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
    keywords: [],
  };
}

export function emptyProject(): ProjectInput {
  return {
    slug: "",
    title: "",
    titleEn: "",
    subtitle: "",
    category: "فیلم تبلیغاتی",
    cover: "",
    poster: "",
    heroVideo: "",
    gallery: [],
    year: new Date().getFullYear(),
    location: "تهران، ایران",
    accent: "#6699ff",
    featured: false,
    published: true,
    tags: [],
    goal: "",
    problem: "",
    idea: "",
    production: "",
    marketing: "",
    result: "",
    metrics: [],
    beforeImage: "",
    afterImage: "",
    credits: [],
    clientId: "",
    serviceSlugs: [],
    industrySlugs: [],
    seo: { metaTitle: "", metaDescription: "", ogImage: "", keywords: [] },
  };
}
