import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { LeadsBoard } from "@/components/admin/LeadsBoard";
import { faNumber } from "@/lib/utils";

export default async function LeadsPage() {
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });
  const won = leads.filter((l) => l.status === "WON").length;
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="سرنخ‌ها (Pipeline)"
        description={`${faNumber(leads.length)} سرنخ · ${faNumber(won)} برنده — برای جابه‌جایی، کارت را بکشید`}
      />
      <LeadsBoard leads={leads} />
    </div>
  );
}
