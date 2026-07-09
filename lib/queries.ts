import { db } from "./db";

// Reusable read queries shared across public pages.

export const getStats = () => db.stat.findMany({ orderBy: { order: "asc" } });

export const getClients = () => db.client.findMany({ orderBy: { order: "asc" } });

export const getFeaturedProjects = (take = 6) =>
  db.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { client: { select: { name: true } } },
    take,
  });

export const getAllProjects = () =>
  db.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { client: { select: { name: true } } },
  });

export const getFeaturedTestimonials = () =>
  db.testimonial.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });

export const getServices = () =>
  db.service.findMany({ where: { published: true }, orderBy: { order: "asc" } });

export const getIndustries = () =>
  db.industry.findMany({ where: { published: true }, orderBy: { order: "asc" } });

export const getFeaturedPosts = (take = 3) =>
  db.post.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    include: { author: { select: { name: true, avatar: true } } },
    take,
  });

export const getTeam = () =>
  db.teamMember.findMany({ where: { published: true }, orderBy: { order: "asc" } });
