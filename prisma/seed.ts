import "dotenv/config";
import argon2 from "argon2";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main(): Promise<void> {
  const passwordHash = await argon2.hash("admin123");

  const tenant = await prisma.tenant.upsert({
    where: {
      id: "development-tenant",
    },
    update: {},
    create: {
      id: "development-tenant",
      name: "Development",
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {
      passwordHash,
      tenantId: tenant.id,
    },
    create: {
      name: "Administrator",
      email: "admin@example.com",
      passwordHash,
      tenantId: tenant.id,
    },
  });
  console.log("Development user created.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
