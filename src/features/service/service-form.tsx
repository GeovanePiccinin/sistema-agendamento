"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TextFormField } from "@/components/forms/text-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import {
  createServiceSchema,
  type CreateServiceData,
  type CreateServiceInput,
} from "./service.schema";
import type { ServiceListItem } from "./service.query";

interface ServiceFormProps {
  service?: ServiceListItem;
  isPending: boolean;
  onSubmit: (data: CreateServiceData) => void;
  onCancel: () => void;
}

export function ServiceForm({
  service,
  isPending,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const form = useForm<CreateServiceInput, undefined, CreateServiceData>({
    resolver: zodResolver(createServiceSchema),

    defaultValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      duration: service ? String(service.duration) : "30",
      price: service ? service.price : "0",
      active: service?.active ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextFormField
          form={form}
          name="name"
          label="Nome"
          placeholder="Ex.: Corte de cabelo"
          disabled={isPending}
        />

        <div className="space-y-2">
          <label htmlFor="service-description" className="text-sm font-medium">
            Descrição
          </label>

          <Textarea
            id="service-description"
            placeholder="Descreva o serviço..."
            disabled={isPending}
            {...form.register("description")}
          />

          {form.formState.errors.description ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          ) : null}
        </div>

        <TextFormField
          form={form}
          name="duration"
          label="Duração (minutos)"
          type="number"
          disabled={isPending}
        />

        <TextFormField
          form={form}
          name="price"
          label="Preço"
          type="number"
          disabled={isPending}
        />

        <div className="flex items-center gap-2">
          <input
            id="service-active"
            type="checkbox"
            disabled={isPending}
            {...form.register("active")}
          />

          <label htmlFor="service-active" className="text-sm font-medium">
            Serviço ativo
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Salvando..."
              : service
                ? "Salvar alterações"
                : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
