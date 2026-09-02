"use client";

import {
  flexRender,
  type ColumnDef,
  type PaginationState,
  type RowData,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { features, useDataTable } from "./table";

export type DataTableColumns<TData extends RowData> = ColumnDef<
  typeof features,
  TData,
  unknown
>[];

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumns<TData>;

  data: TData[];

  sorting: SortingState;

  onSortingChange: (updater: Updater<SortingState>) => void;

  pagination: PaginationState;

  onPaginationChange: (updater: Updater<PaginationState>) => void;

  rowCount: number;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  rowCount,
}: DataTableProps<TData>) {
  const table = useDataTable<TData>({
    columns,
    data,

    state: {
      sorting,
      pagination,
    },

    rowCount,

    manualSorting: true,
    manualPagination: true,

    onSortingChange,
    onPaginationChange,
  });

  const pageCount = Math.max(1, Math.ceil(rowCount / pagination.pageSize));

  const currentPage = pagination.pageIndex + 1;

  const canPreviousPage = pagination.pageIndex > 0;

  const canNextPage = pagination.pageIndex < pageCount - 1;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();

                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className="h-10 px-4 text-left align-middle font-medium"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="-ml-3 h-8 px-3"
                          onClick={() =>
                            header.column.toggleSorting(sorted === "asc")
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          {sorted === "asc" ? (
                            <ArrowUp className="ml-2 size-4" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="ml-2 size-4" />
                          ) : (
                            <ChevronsUpDown className="ml-2 size-4" />
                          )}
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Página {currentPage} de {pageCount}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canPreviousPage}
            onClick={() =>
              onPaginationChange((current) => ({
                ...current,
                pageIndex: current.pageIndex - 1,
              }))
            }
          >
            <ChevronLeft />
            Anterior
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canNextPage}
            onClick={() =>
              onPaginationChange((current) => ({
                ...current,
                pageIndex: current.pageIndex + 1,
              }))
            }
          >
            Próxima
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
