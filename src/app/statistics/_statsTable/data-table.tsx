/* eslint-disable prettier/prettier */
"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RangeCalendar } from "@nextui-org/react";
import React, { useEffect } from "react";
import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { getStatsUserList } from "../api";
import { today, getLocalTimeZone } from "@internationalized/date";
import { isWithinInterval, parseISO } from "date-fns";
import { StatsUserList } from "@/lib/references/stats/types";

export function DataTable() {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["Get users for general statistics"],
    queryFn: async () => await getStatsUserList(),
  });

  const [filteredData, setFilteredData] = React.useState<StatsUserList[]>(
    isFetched && data
  );
  const [dateVal, setDateVal] = React.useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });
  const handleSetTimeRangeFilter = () => {
    const startDate = new Date(
      dateVal.start.year,
      dateVal.start.month - 1,
      dateVal.start.day
    ).toISOString();

    const endDate = new Date(
      dateVal.end.year,
      dateVal.end.month - 1,
      dateVal.end.day
    ).toISOString();
    if (isFetched) {
      let bidSumArr = [];

      const sumAmountsForDateRange = (user: StatsUserList) => {
        return user.created_at.reduce((total, date, index) => {
          if (isWithinInterval(date, { start: startDate, end: endDate })) {
            bidSumArr.push(user.amount[index]);
            return total + user.amount[index];
          }

          return total;
        }, 0);
      };
      const filtered = data
        .map((user) => {
          const totalAmountInRange = sumAmountsForDateRange(user);
          const bidSum = bidSumArr.length;
          return { ...user, totalAmountInRange, bidSum };
        })
        .filter((user) => user.totalAmountInRange > 0);

      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    handleSetTimeRangeFilter();
  }, [dateVal]);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-60">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="rounded-md border w-5/6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Таблица пуста
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* <div className="flex items-center justify-between space-x-2 py-1">
          <div>
            <Button
              variant="light"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeftIcon />
            </Button>
          </div>
          <div>
            <Button
              variant="light"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div> */}
      </div>
      <div className="ml-8 sticky">
        <RangeCalendar
          aria-label="Date (Uncontrolled)"
          color="foreground"
          value={dateVal}
          onChange={setDateVal}
          maxValue={today(getLocalTimeZone())}
        />
      </div>
    </div>
  );
}
