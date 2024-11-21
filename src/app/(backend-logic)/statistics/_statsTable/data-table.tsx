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
import { Input, RangeCalendar } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { isWithinInterval } from "date-fns";
import { StatsUserList } from "@/lib/references/stats/types";
import { getStatsUserList } from "../_api";

export function DataTable() {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["Get users for general statistics"],
    queryFn: async () => await getStatsUserList(),
  });
  const [filteredData, setFilteredData] = useState<StatsUserList[]>([]);
  const [dateVal, setDateVal] = useState({
    start: parseDate(
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`
    ),
    end: today(getLocalTimeZone()),
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
    console.log(filteredData);
    const startDate = new Date(
      dateVal.start.year,
      dateVal.start.month - 1,
      dateVal.start.day - 1
    ).toISOString();
    const endDate = new Date(
      dateVal.end.year,
      dateVal.end.month - 1,
      dateVal.end.day + 1
    ).toISOString();

    const sumAmountsForDateRange = (user: StatsUserList) => {
      let bidSumArr = [];
      let total = 0;

      total = user.created_at.reduce((sum, date, index) => {
        if (isWithinInterval(date, { start: startDate, end: endDate })) {
          bidSumArr.push(user.value[index]);
          return sum + Number(user.value[index]);
        }
        return sum;
      }, 0);

      return { total, bidSumArr };
    };

    const filtered = data
      .map((user) => {
        const { total, bidSumArr } = sumAmountsForDateRange(user);
        const totalBidsInRange = bidSumArr.length;
        const bidSum = user.value.length;

        return { ...user, totalAmountInRange: total, totalBidsInRange, bidSum };
      })
      .filter(
        (user) =>
          user.role == "Логист" ||
          user.role === "Логист Дистант" ||
          user.role == "Логист Москва"
      )
      .sort((a, b) => b.totalAmountInRange - a.totalAmountInRange);

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (isFetched && data) {
      handleSetTimeRangeFilter();
    }
  }, [dateVal, data, isFetched]);
  if (isLoading) {
    return (
      <div className="flex justify-center mt-60">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex mt-5">
        <div className="rounded-md border w-5/6 h-2/4">
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
    </div>
  );
}
