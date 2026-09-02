import { z } from "zod";

const serviceFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve possuir pelo menos 2 caracteres.")
    .max(100, "O nome deve possuir no máximo 100 caracteres."),

  description: z
    .string()
    .trim()
    .max(500, "A descrição deve possuir no máximo 500 caracteres.")
    .optional()
    .or(z.literal("")),

  duration: z.coerce
    .number({
      error: "Informe a duração.",
    })
    .int("A duração deve ser um número inteiro.")
    .positive("A duração deve ser maior que zero."),

  price: z.coerce
    .number({
      error: "Informe o preço.",
    })
    .nonnegative("O preço não pode ser negativo."),

  active: z.boolean(),
});

export const createServiceSchema = serviceFieldsSchema;

export const updateServiceSchema = serviceFieldsSchema.extend({
  id: z.string().min(1),
});

export const deleteServiceSchema = z.object({
  id: z.string().min(1),
});

export type CreateServiceInput = z.input<typeof createServiceSchema>;

export type CreateServiceData = z.output<typeof createServiceSchema>;

export type UpdateServiceInput = z.input<typeof updateServiceSchema>;

export type UpdateServiceData = z.output<typeof updateServiceSchema>;

export type DeleteServiceInput = z.infer<typeof deleteServiceSchema>;
