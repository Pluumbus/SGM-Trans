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
import { UseTableProps } from "./types";
import { renderColumns, renderRows } from "./helpers";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { UPagination, UTableTopContent } from "./ui";
import { useRowsPerPage } from "./hooks";

export const UTable = <T,>({
  data = [],
  columns = [],
  name = "some table",
  config,
  props,
  tBodyProps,
  isPagiantion = false,
}: UseTableProps<T>): ReactNode => {
  const [mdata, setMData] = useState(data);

  useEffect(() => {
    if (data) {
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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: isPagiantion ? Number(rowsPerPage) : 9999999,
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
    <div className="flex flex-col h-screen">
      <UTableTopContent tInstance={tInstance} />
      <div className="flex-grow overflow-hidden">
        <Table
          aria-label={name}
          isCompact={true}
          isStriped={true}
          {...props}
          isHeaderSticky={true}
          className="h-full"
        >
          <TableHeader>{renderColumns(tInstance)}</TableHeader>
          <TableBody
            {...tBodyProps}
            className="overflow-auto h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
          >
            {renderRows(tInstance, config!.row)}
          </TableBody>
        </Table>
      </div>
      {isPagiantion && (
        <UPagination tInstance={tInstance} isPagiantion={isPagiantion} />
      )}
    </div>
  );
};
