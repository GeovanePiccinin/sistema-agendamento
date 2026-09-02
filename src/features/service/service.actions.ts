"use server";

import { auth } from "@/auth";

import { logger } from "@/lib/logger/logger";

import {
  createServiceSchema,
  deleteServiceSchema,
  updateServiceSchema,
} from "./service.schema";

import {
  createService,
  deleteService,
  findServices,
  updateService,
} from "./service.repository";

import {
  serviceListQuerySchema,
  type ServiceListResult,
} from "./service.query";

async function getTenantId(): Promise<string> {
  const session = await auth();

  const tenantId = session?.user?.tenantId;

  if (!tenantId) {
    throw new Error("Usuário não autenticado.");
  }

  return tenantId;
}

export async function getServices(input: unknown): Promise<ServiceListResult> {
  const tenantId = await getTenantId();

  const query = serviceListQuerySchema.parse(input);

  return findServices(tenantId, query);
}

export async function createServiceAction(input: unknown): Promise<void> {
  const tenantId = await getTenantId();
  const data = createServiceSchema.parse(input);

  try {
    await createService(tenantId, data);

    logger.info(
      {
        operation: "service.create",
        tenantId,
      },
      "Service created",
    );
  } catch (error: unknown) {
    logger.error(
      {
        operation: "service.create",
        tenantId,
        error,
      },
      "Failed to create service",
    );

    throw error;
  }
}

export async function updateServiceAction(input: unknown): Promise<void> {
  const tenantId = await getTenantId();
  const data = updateServiceSchema.parse(input);

  try {
    await updateService(tenantId, data);

    logger.info(
      {
        operation: "service.update",
        tenantId,
        serviceId: data.id,
      },
      "Service updated",
    );
  } catch (error: unknown) {
    logger.error(
      {
        operation: "service.update",
        tenantId,
        serviceId: data.id,
        error,
      },
      "Failed to update service",
    );

    throw error;
  }
}

export async function deleteServiceAction(input: unknown): Promise<void> {
  const tenantId = await getTenantId();
  const data = deleteServiceSchema.parse(input);

  try {
    await deleteService(tenantId, data.id);

    logger.info(
      {
        operation: "service.delete",
        tenantId,
        serviceId: data.id,
      },
      "Service deleted",
    );
  } catch (error: unknown) {
    logger.error(
      {
        operation: "service.delete",
        tenantId,
        serviceId: data.id,
        error,
      },
      "Failed to delete service",
    );

    throw error;
  }
}
