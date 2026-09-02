import { z } from "zod";

export const serviceListQuerySchema = z.object({
  search: z.string().trim().max(100).default(""),

  page: z.number().int().positive().default(1),

  pageSize: z.number().int().positive().max(100).default(20),

  sortBy: z
    .enum(["name", "duration", "price", "active", "createdAt"])
    .default("name"),

  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

export type ServiceListQuery = z.infer<typeof serviceListQuerySchema>;

export interface ServiceListItem {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceListResult {
  items: ServiceListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}
