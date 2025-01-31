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
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { UPagination, UTableTopContent } from "./ui";
import { useRowsPerPage } from "./hooks";
import { customFilter } from "./helpers/customFilter";
import { customArrayFilter } from "./helpers/customArrayfilter";
import { SgmSpinner } from "@/components/ui/SgmSpinner";

export const UTable = <T,>({
  data = [],
  columns = [],
  name = "some table",
  config,
  props,
  tBodyProps,
  isPagiantion = false,
}: UseTableProps<T>): ReactNode => {
  const mdata = useMemo(() => data, [data]);

  const mColumns = useMemo(() => {
    const normalCols = columns.map((e: any) => {
      if (e.filterFn) {
        return e;
      }

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

    filterFns: {
      customFilter,
      customArrayFilter,
    },
  });

  const [highlightedRows, setHighlightedRows] = useState<Set<string>>(
    new Set()
  );

  const toggleHighlight = (rowId: string) => {
    setHighlightedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col h-fit">
      <UTableTopContent tInstance={tInstance} name={name} />
      <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 bg-pi">
        <Table
          aria-label={name}
          isCompact={true}
          isStriped={true}
          {...props}
          isHeaderSticky={true}
          className="h-full max-h-screen"
        >
          <TableHeader>{renderColumns(tInstance)}</TableHeader>
          <TableBody {...tBodyProps} loadingContent={<SgmSpinner />}>
            {renderRows(
              tInstance,
              config!.row,
              highlightedRows,
              toggleHighlight
            )}
          </TableBody>
        </Table>
      </div>
      {isPagiantion && (
        <UPagination tInstance={tInstance} isPagiantion={isPagiantion} />
      )}
    </div>
  );
};
