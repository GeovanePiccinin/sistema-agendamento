import {
  createTableHook,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  type RowData,
} from "@tanstack/react-table";

export const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
});

const { useAppTable: createAppTable, createAppColumnHelper } = createTableHook({
  features,

  manualSorting: true,
  manualPagination: true,
});

export { createAppColumnHelper };

export function useDataTable<TData extends RowData>(
  options: Parameters<typeof createAppTable<TData>>[0],
) {
  return createAppTable<TData>(options);
}
