/**
 * @vitest-environment node
 */

import { beforeEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db/prisma";

import { createService, findServices } from "./service.repository";

import { createServiceSchema } from "./service.schema";

describe("Service", () => {
  let tenantAId: string;
  let tenantBId: string;

  beforeEach(async () => {
    await prisma.service.deleteMany();

    await prisma.tenant.deleteMany();

    const tenantA = await prisma.tenant.create({
      data: {
        name: "Tenant A",
      },
    });

    const tenantB = await prisma.tenant.create({
      data: {
        name: "Tenant B",
      },
    });

    tenantAId = tenantA.id;
    tenantBId = tenantB.id;
  });

  describe("schema", () => {
    it("accepts valid data", () => {
      const result = createServiceSchema.safeParse({
        name: "Corte masculino",
        description: "Corte tradicional",
        duration: 30,
        price: 50,
        active: true,
      });

      expect(result.success).toBe(true);
    });

    it("rejects invalid data", () => {
      const result = createServiceSchema.safeParse({
        name: "",
        description: "",
        duration: 0,
        price: -10,
        active: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("repository", () => {
    it("creates and lists a service", async () => {
      await createService(tenantAId, {
        name: "Corte masculino",
        description: "Corte tradicional",
        duration: 30,
        price: 50,
        active: true,
      });

      const result = await findServices(tenantAId, {
        search: "",
        page: 1,
        pageSize: 20,
        sortBy: "name",
        sortDirection: "asc",
      });

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({
        name: "Corte masculino",
        duration: 30,
        price: "50",
        active: true,
      });
    });

    it("isolates services by tenant", async () => {
      await createService(tenantAId, {
        name: "Corte masculino",
        description: "",
        duration: 30,
        price: 50,
        active: true,
      });

      await createService(tenantBId, {
        name: "Manicure",
        description: "",
        duration: 45,
        price: 70,
        active: true,
      });

      const result = await findServices(tenantAId, {
        search: "",
        page: 1,
        pageSize: 20,
        sortBy: "name",
        sortDirection: "asc",
      });

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Corte masculino");
    });
  });
});
