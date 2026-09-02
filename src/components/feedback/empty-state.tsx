import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
      <Inbox aria-hidden="true" className="mb-3 size-8 text-muted-foreground" />

      <h3 className="font-medium">{title}</h3>

      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
