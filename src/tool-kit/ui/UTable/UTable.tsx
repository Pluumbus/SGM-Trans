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
  ColumnDef,
} from "@tanstack/react-table";
import { UseTableColumnsSchema, UseTableProps } from "./types";
import { renderColumns, renderRows } from "./helpers";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { UPagination, UTableTopContent } from "./ui";
import { useRowsPerPage } from "./hooks";

export const UTable = <T,>({
  data = [],
  columns = [],
  name = "some table",
  config,
}: UseTableProps<T>): ReactNode => {
  const [mdata, setMData] = useState(data);

  useEffect(() => {
    if (data) {
      console.log("New data hello: ", data);

      setMData(data);
    }
  }, [data]);

  const mColumns = useMemo(() => {
    const normalCols = columns.map((e: any) => {
      e.filterFn = "includesString";
      return e;
    });

    return normalCols;
  }, [columns]);
  const { rowsPerPage } = useRowsPerPage();

  const mConfig = useMemo(() => config, [config]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: Number(rowsPerPage),
  });

  const tInstance = useReactTable<T>({
    data: mdata,
    columns: mColumns as ColumnDef<T, any>[],
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
        <TableBody>{renderRows(tInstance, mConfig!.row)}</TableBody>
      </Table>
      <UPagination tInstance={tInstance} />
    </div>
  );
};
