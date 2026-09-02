"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { TextFormField } from "@/components/forms/text-form-field";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve possuir pelo menos 2 caracteres."),

  email: z.email("Informe um e-mail válido."),
});

type FormData = z.infer<typeof formSchema>;

export function FormTest() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextFormField
          form={form}
          name="name"
          label="Nome"
          placeholder="Digite o nome"
        />

        <TextFormField
          form={form}
          name="email"
          label="E-mail"
          placeholder="Digite o e-mail"
          type="email"
        />

        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
