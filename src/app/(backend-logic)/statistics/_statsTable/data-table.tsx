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
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { isWithinInterval } from "date-fns";
import { StatsUserList } from "@/lib/references/stats/types";
import { getStatsUserList } from "../_api";
import { getSeparatedNumber, useNumberState } from "@/tool-kit/hooks";
import { CustomWeekSelector } from "../_features/CustomWeekSelector";
import { calculateCurrentPrize } from "@/components/ui/ProfileButton/Prize/PrizeFormula";
import { ProfilePrize } from "@/components/ui/ProfileButton/Prize/Prize";

export function DataTable() {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["Get users for general statistics"],
    queryFn: async () => await getStatsUserList(),
  });
  const [filteredData, setFilteredData] = useState<StatsUserList[]>([]);
  const [dateVal, setDateVal] = useState({
    start: "",
    end: "",
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

  const findMaxValue = (data) => {
    return data.reduce(
      (max, item) =>
        item.totalAmountInRange > max ? item.totalAmountInRange : max,
      0
    );
  };

  const handleSetTimeRangeFilter = () => {
    const sumAmountsForDateRange = (user: StatsUserList) => {
      let bidSumArr = [];
      let total = 0;
      total = user.created_at.reduce((sum, date, index) => {
        if (
          isWithinInterval(date, { start: dateVal.start, end: dateVal.end })
        ) {
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
        const bidPrize =
          calculateCurrentPrize(total) + bidSumArr.length > 25 &&
          (bidSumArr.length - 25) * 1000;

        // const currentPrizeSum =
        //   bidSumArr.length > 25 ? calculateCurrentPrize(total) + bidPrize : 0;

        const amount = user.value.reduce((acc, item) => {
          return acc + item;
        }, 0);

        return {
          ...user,
          amount: getSeparatedNumber(amount),
          totalAmountInRange: total,
          totalBidsInRange: bidSumArr.length,
          bidSum: user.value.length,
          prizeSum: bidPrize,
          currentWeek: { start: dateVal.start, end: dateVal.end },
        };
      })
      .filter(
        (user) =>
          user.role == "Логист" ||
          user.role === "Логист Дистант" ||
          user.role == "Логист Москва"
      )
      .sort((a, b) => b.bidSum - a.bidSum);

    const leaderUserSum = findMaxValue(filtered);

    const totalPrize = filtered.reduce((acc, curr) => {
      return acc + curr.totalAmountInRange;
    }, 0);
    console.log(totalPrize);
    const newData = filtered.map((item) => {
      return {
        ...item,
        totalAmountInRange: getSeparatedNumber(item.totalAmountInRange),
        prizeSum: getSeparatedNumber(
          calculateCurrentPrize(totalPrize) > 0
            ? calculateCurrentPrize(totalPrize) + item.prizeSum
            : 0
        ),
        leadUserSum:
          item.totalAmountInRange == leaderUserSum ? leaderUserSum : 0,
      };
    });
    setFilteredData(newData);
  };

  useEffect(() => {
    if (isFetched && data) {
      handleSetTimeRangeFilter();
    }
  }, [dateVal, data, isFetched]);

  if (isLoading) {
    return <Spinner />;
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
          {/* <RangeCalendar
            aria-label="Date (Uncontrolled)"
            color="foreground"
            value={dateVal}
            onChange={setDateVal}
            maxValue={today(getLocalTimeZone())}
          /> */}
          <CustomWeekSelector setDateVal={setDateVal} />
        </div>
      </div>
    </div>
  );
}
