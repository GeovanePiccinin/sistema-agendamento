import { z } from "zod";

import { AttendanceStatus } from "@/generated/prisma/enums";

export const attendanceListQuerySchema = z
  .object({
    search: z.string().trim().max(100).default(""),
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().max(100).default(10),
    sortBy: z
      .enum(["startAt", "status", "client", "professional", "service"])
      .default("startAt"),
    sortDirection: z.enum(["asc", "desc"]).default("asc"),
    from: z.iso.datetime().optional(),
    toExclusive: z.iso.datetime().optional(),
    status: z.enum(AttendanceStatus).optional(),
  })
  .superRefine((query, context) => {
    if (
      query.from &&
      query.toExclusive &&
      new Date(query.from) >= new Date(query.toExclusive)
    ) {
      context.addIssue({
        code: "custom",
        path: ["toExclusive"],
        message: "O período final deve ser posterior ao período inicial.",
      });
    }
  });

export type AttendanceListQuery = z.infer<typeof attendanceListQuerySchema>;
export type AttendanceStatusValue = keyof typeof AttendanceStatus;

export interface AttendanceListItem {
  id: string;
  status: AttendanceStatusValue;
  startedAt: Date | null;
  completedAt: Date | null;
  notes: string | null;
  appointment: {
    id: string;
    startAt: Date;
    endAt: Date;
    status: string;
    client: {
      id: string;
      name: string;
    };
    professional: {
      id: string;
      name: string;
    };
    service: {
      id: string;
      name: string;
    };
  };
  hasRelatedRecords: boolean;
}

export interface AttendanceListResult {
  items: AttendanceListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface AttendanceAppointmentOption {
  id: string;
  startAt: Date;
  endAt: Date;
  clientName: string;
  professionalName: string;
  serviceName: string;
}

export interface AttendanceFormOptions {
  appointments: AttendanceAppointmentOption[];
}
