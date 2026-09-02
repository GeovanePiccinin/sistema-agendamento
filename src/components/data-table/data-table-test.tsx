"use client";

import { useState } from "react";

import type { PaginationState, SortingState } from "@tanstack/react-table";

import { DataTable } from "./data-table";
import { createAppColumnHelper } from "./table";

interface TestRow {
  id: string;
  name: string;
  email: string;
}

const columnHelper = createAppColumnHelper<TestRow>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Nome",
    enableSorting: true,
  }),

  columnHelper.accessor("email", {
    header: "E-mail",
    enableSorting: true,
  }),
]);

const data: TestRow[] = [
  {
    id: "1",
    name: "João",
    email: "joao@example.com",
  },
  {
    id: "2",
    name: "Maria",
    email: "maria@example.com",
  },
  {
    id: "3",
    name: "Pedro",
    email: "pedro@example.com",
  },
];

export function DataTableTest() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <DataTable<TestRow>
      columns={columns}
      data={data}
      sorting={sorting}
      onSortingChange={setSorting}
      pagination={pagination}
      onPaginationChange={setPagination}
      rowCount={data.length}
    />
  );
}
