"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FeedbackTest() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        onClick={() => {
          toast.success("Operação realizada com sucesso.");
        }}
      >
        Sucesso
      </Button>

      <Button
        type="button"
        variant="destructive"
        onClick={() => {
          toast.error("Não foi possível realizar a operação.");
        }}
      >
        Erro
      </Button>
    </div>
  );
}
