/* CLI entry point for local seeding: `npm run db:seed`.
   Shared logic lives in prisma/seed-logic.ts so it can also be triggered
   in production via app/api/admin/seed/route.ts (one-time, secret-protected). */
import { seedDatabase } from "./seed-logic";

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => process.exit(0));
