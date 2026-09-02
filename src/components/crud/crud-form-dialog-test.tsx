"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CrudFormDialog } from "@/components/crud/crud-form-dialog";
import { FormTest } from "@/components/forms/form-test";

export function CrudFormDialogTest() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Abrir formulário
      </Button>

      <CrudFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Novo registro"
        description="Preencha os dados do registro."
      >
        <FormTest />
      </CrudFormDialog>
    </>
  );
}
