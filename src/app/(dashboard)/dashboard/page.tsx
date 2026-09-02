import { DataTableTest } from "@/components/data-table/data-table-test";
import { QueryTest } from "@/components/query/query-test";
import { FeedbackTest } from "@/components/feedback/feedback-test";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { FormTest } from "@/components/forms/form-test";
import { CrudFormDialogTest } from "@/components/crud/crud-form-dialog-test";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">Visão geral do sistema.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Carregando</h2>

        <DataTableSkeleton columns={3} rows={5} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Formulário</h2>

          <p className="text-sm text-muted-foreground">
            Teste da integração entre React Hook Form, Zod e os componentes de
            formulário.
          </p>
        </div>

        <div className="max-w-md">
          <FormTest />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Formulário em Dialog</h2>

          <p className="text-sm text-muted-foreground">
            Teste do formulário utilizado para criação e edição.
          </p>
        </div>

        <CrudFormDialogTest />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Feedback</h2>

        <FeedbackTest />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Infraestrutura</h2>

        <QueryTest />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">Usuários</h2>

          <p className="text-sm text-muted-foreground">
            Exemplo de utilização do DataTable.
          </p>
        </div>

        <DataTableTest />
      </section>
    </div>
  );
}
