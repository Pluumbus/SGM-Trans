"use client";
import { Table, TableHeader, TableBody } from "@nextui-org/react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { DataType, UseTableProps } from "./types";
import { renderColumns, renderRows } from "./helpers";
import { ReactNode, useMemo, useState } from "react";
import { UPagination, UTableTopContent } from "./ui";
import { useRowsPerPage } from "./hooks";

export const UTable = <T extends DataType<T>>({
  data = [],
  columns = [],
  name = "some table",
  config,
}: UseTableProps<DataType<T>>): ReactNode => {
  const mColumns = useMemo(() => {
    const normalCols = columns.map((e) => {
      e.filterFn = "includesString";
      return e;
    });

    return normalCols;
  }, [columns]);
  const { rowsPerPage } = useRowsPerPage();
  const mData = useMemo(() => data, [data]);
  const mConfig = useMemo(() => config, [config]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: Number(rowsPerPage),
  });

  const tInstance = useReactTable({
    data: mData,
    columns: mColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
  });

  return (
    <div>
      <UTableTopContent tInstance={tInstance} />
      <Table color="primary" aria-label={name} isStriped isCompact>
        <TableHeader>{renderColumns(tInstance)}</TableHeader>
        <TableBody>{renderRows(tInstance, mConfig?.row)}</TableBody>
      </Table>
      <UPagination tInstance={tInstance} />
    </div>
  );
};
