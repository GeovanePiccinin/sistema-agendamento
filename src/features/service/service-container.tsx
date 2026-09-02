"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { SortingState } from "@tanstack/react-table";

import { Pencil, Plus, Trash2 } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { createAppColumnHelper } from "@/components/data-table/table";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { SearchInput } from "@/components/search-input/search-input";
import { Button } from "@/components/ui/button";

import { useListControls } from "@/hooks/use-list-controls";

import { toast } from "sonner";

import { CrudConfirmDialog } from "@/components/crud/crud-confirm-dialog";
import { CrudFormDialog } from "@/components/crud/crud-form-dialog";

import {
  createServiceAction,
  deleteServiceAction,
  getServices,
  updateServiceAction,
} from "./service.actions";

import type { CreateServiceData } from "./service.schema";

import type { ServiceListItem, ServiceListQuery } from "./service.query";

import { ServiceForm } from "./service-form";

type ServiceSortField = "name" | "duration" | "price" | "active" | "createdAt";

const PAGE_SIZE = 10;

const allowedSortFields: ServiceSortField[] = [
  "name",
  "duration",
  "price",
  "active",
  "createdAt",
];

function getSortingQuery(
  sorting: SortingState,
): Pick<ServiceListQuery, "sortBy" | "sortDirection"> {
  const firstSort = sorting[0];

  if (!firstSort) {
    return {
      sortBy: "name",
      sortDirection: "asc",
    };
  }

  const sortBy = allowedSortFields.includes(firstSort.id as ServiceSortField)
    ? (firstSort.id as ServiceSortField)
    : "name";

  return {
    sortBy,
    sortDirection: firstSort.desc ? "desc" : "asc",
  };
}

export function ServiceContainer() {
  const queryClient = useQueryClient();

  const {
    search,
    debouncedSearch,
    sorting,
    pagination,
    setSearch,
    setSorting,
    setPagination,
  } = useListControls<ServiceSortField>({
    initialPageSize: PAGE_SIZE,
    debounceDelay: 400,
  });

  const [formOpen, setFormOpen] = useState(false);

  const [editingService, setEditingService] = useState<
    ServiceListItem | undefined
  >();

  const [deletingService, setDeletingService] = useState<
    ServiceListItem | undefined
  >();

  const sortingQuery = getSortingQuery(sorting);

  const query: ServiceListQuery = {
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: sortingQuery.sortBy,
    sortDirection: sortingQuery.sortDirection,
  };

  const servicesQuery = useQuery({
    queryKey: [
      "services",
      query.search,
      query.page,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
    ],

    queryFn: () => getServices(query),

    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createServiceAction,

    onSuccess: async () => {
      toast.success("Serviço cadastrado com sucesso.");

      setFormOpen(false);

      await queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o serviço.",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateServiceAction,

    onSuccess: async () => {
      toast.success("Serviço atualizado com sucesso.");

      setFormOpen(false);
      setEditingService(undefined);

      await queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o serviço.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteServiceAction,

    onSuccess: async () => {
      toast.success("Serviço excluído com sucesso.");

      setDeletingService(undefined);

      await queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o serviço.",
      );
    },
  });

  const isFormPending = createMutation.isPending || updateMutation.isPending;

  function handleCreate() {
    setEditingService(undefined);
    setFormOpen(true);
  }

  function handleEdit(service: ServiceListItem) {
    setEditingService(service);
    setFormOpen(true);
  }

  function handleFormSubmit(data: CreateServiceData) {
    if (editingService) {
      updateMutation.mutate({
        id: editingService.id,
        ...data,
      });

      return;
    }

    createMutation.mutate(data);
  }

  function handleDelete() {
    if (!deletingService) {
      return;
    }

    deleteMutation.mutate({
      id: deletingService.id,
    });
  }

  const columnHelper = createAppColumnHelper<ServiceListItem>();

  const columns = columnHelper.columns([
    columnHelper.accessor("name", {
      header: "Nome",
      enableSorting: true,
    }),

    columnHelper.accessor("duration", {
      header: "Duração",
      enableSorting: true,

      cell: ({ getValue }) => `${getValue()} min`,
    }),

    columnHelper.accessor("price", {
      header: "Preço",
      enableSorting: true,

      cell: ({ getValue }) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(getValue())),
    }),

    columnHelper.accessor("active", {
      header: "Status",
      enableSorting: true,

      cell: ({ getValue }) => (getValue() ? "Ativo" : "Inativo"),
    }),

    columnHelper.display({
      id: "actions",

      header: "Ações",

      enableSorting: false,

      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            aria-label={`Editar ${row.original.name}`}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDeletingService(row.original)}
            aria-label={`Excluir ${row.original.name}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    }),
  ]);

  if (servicesQuery.isPending && !servicesQuery.data) {
    return (
      <div className="space-y-4">
        <ServiceHeader onCreate={handleCreate} />

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar serviços..."
        />

        <DataTableSkeleton columns={5} rows={PAGE_SIZE} />
      </div>
    );
  }

  if (servicesQuery.isError && !servicesQuery.data) {
    return (
      <div className="space-y-4">
        <ServiceHeader onCreate={handleCreate} />

        <ErrorState
          title="Não foi possível carregar os serviços."
          description="Tente novamente. Se o problema persistir, verifique sua conexão."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void servicesQuery.refetch();
              }}
            >
              Tentar novamente
            </Button>
          }
        />
      </div>
    );
  }

  const data = servicesQuery.data;

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <ServiceHeader onCreate={handleCreate} />

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar serviços..."
        />

        {data.items.length === 0 ? (
          <EmptyState
            title={
              debouncedSearch
                ? "Nenhum serviço encontrado"
                : "Nenhum serviço cadastrado"
            }
            description={
              debouncedSearch
                ? "Tente alterar os termos da busca."
                : "Cadastre o primeiro serviço para começar."
            }
            action={
              !debouncedSearch ? (
                <Button type="button" onClick={handleCreate}>
                  <Plus />
                  Novo serviço
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="relative">
            {servicesQuery.isFetching ? (
              <div className="absolute right-2 top-2 z-10 flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                <span
                  className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                Atualizando...
              </div>
            ) : null}

            <div
              className={
                servicesQuery.isFetching
                  ? "opacity-60 transition-opacity"
                  : "transition-opacity"
              }
            >
              <DataTable<ServiceListItem>
                columns={columns}
                data={data.items}
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                rowCount={data.total}
              />
            </div>
          </div>
        )}
      </div>

      <CrudFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          if (isFormPending && !open) {
            return;
          }

          setFormOpen(open);

          if (!open) {
            setEditingService(undefined);
          }
        }}
        title={editingService ? "Editar serviço" : "Novo serviço"}
        description={
          editingService
            ? "Atualize os dados do serviço."
            : "Cadastre um novo serviço."
        }
      >
        {formOpen ? (
          <ServiceForm
            key={editingService?.id ?? "new"}
            service={editingService}
            isPending={isFormPending}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditingService(undefined);
            }}
          />
        ) : null}
      </CrudFormDialog>

      <CrudConfirmDialog
        open={deletingService !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingService(undefined);
          }
        }}
        title="Excluir serviço?"
        description={
          deletingService
            ? `O serviço "${deletingService.name}" será excluído permanentemente.`
            : "Esta operação não poderá ser desfeita."
        }
        confirmLabel={deleteMutation.isPending ? "Excluindo..." : "Excluir"}
        confirmDisabled={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}

interface ServiceHeaderProps {
  onCreate: () => void;
}

function ServiceHeader({ onCreate }: ServiceHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Gerencie os serviços disponíveis para agendamento.
        </p>
      </div>

      <Button type="button" onClick={onCreate}>
        <Plus />
        Novo serviço
      </Button>
    </div>
  );
}
