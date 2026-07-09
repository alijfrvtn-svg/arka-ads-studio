import { db } from "@/lib/db";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { emptyProject } from "@/lib/empty-content";

export default async function NewProjectPage() {
  const [clients, services, industries] = await Promise.all([
    db.client.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.service.findMany({ select: { slug: true, title: true }, orderBy: { order: "asc" } }),
    db.industry.findMany({ select: { slug: true, title: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <ProjectEditor
      initial={emptyProject()}
      clients={clients}
      services={services.map((s) => ({ value: s.slug, label: s.title }))}
      industries={industries.map((i) => ({ value: i.slug, label: i.title }))}
    />
  );
}
