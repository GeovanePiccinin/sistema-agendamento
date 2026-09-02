import "dotenv/config";
import { checkDatabaseConnection } from "@/lib/db/check-connection";

async function main(): Promise<void> {
  await checkDatabaseConnection();

  console.log("Database connection OK");
}

main().catch((error: unknown) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
