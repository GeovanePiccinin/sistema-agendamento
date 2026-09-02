import { prisma } from "@/lib/db/prisma";

export async function checkDatabaseConnection(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}
