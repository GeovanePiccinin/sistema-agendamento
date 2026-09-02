import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function ErrorState({
  title = "Não foi possível carregar os dados",
  description = "Ocorreu um erro inesperado. Tente novamente.",
  action,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
      <AlertCircle
        aria-hidden="true"
        className="mb-3 size-8 text-destructive"
      />

      <h3 className="font-medium">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
