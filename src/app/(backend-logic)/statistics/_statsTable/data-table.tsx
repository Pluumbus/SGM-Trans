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
import { StatsUserList } from "@/lib/references/stats/types";
import { AllCargosByWeek, getAllCargosByWeek } from "../_api";
import { getSeparatedNumber, useNumberState } from "@/tool-kit/hooks";
import { CustomWeekSelector } from "../_features/CustomWeekSelector";
import { calculateCurrentPrize } from "@/app/(backend-logic)/profile/feature/ProfileButton/Prize/PrizeFormula";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";

export function DataTable() {
  const {
    data: joinData,
    isFetched: isJoinFetched,
    isLoading,
  } = useQuery({
    queryKey: ["getTablesJoinDataAndUsersList"],
    queryFn: async () => await getAllCargosByWeek(),
  });

  const { data: allUsers, isFetched } = useQuery({
    queryKey: ["getUsersList"],
    queryFn: async () => await getUserList(),
  });

  const userList =
    allUsers &&
    allUsers?.map((user) => ({
      user_id: user.id,
      userName: user.userName || "Имя отсутствует",
      avatar: user.imageUrl,
      role: user.role as string | undefined,
    }));

  console.log(joinData);
  const [tableData, setTableData] = useState<StatsUserList[]>([]);

  const [weekNum, setWeekNum] = useState<number>();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: tableData,
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

  const handleSetWeekFilter = () => {
    const sumUsersCargos = (
      data: AllCargosByWeek[] = [],
      users: StatsUserList[] = []
    ) => {
      return (
        users
          // .filter(
          //   (user) =>
          //     user.role === "Логист Кз" ||
          //     user.role === "Логист Дистант" ||
          //     user.role === "Логист Москва" ||
          //     user.role === "Супер Логист" ||
          //     user.role === "Админ"
          // )
          .map((user) => {
            let totalAmountInRange = 0;
            let totalBidsInRange = 0;
            let totalAmount = 0;
            let totalBids = 0;

            data
              .filter((d) => d.week_number === weekNum)
              .forEach((week) => {
                week.trips.forEach((trip) => {
                  trip.cargos
                    .filter((crg) => !crg.is_deleted)
                    .forEach((cargo) => {
                      if (cargo.user_id === user.user_id) {
                        totalAmountInRange += Number(cargo.amount.value);
                        totalBidsInRange += 1;
                      }
                    });
                });
              });
            data.forEach((week) => {
              week.trips.forEach((trip) => {
                trip.cargos.forEach((cargo) => {
                  if (cargo.user_id === user.user_id) {
                    totalAmount += Number(cargo.amount.value);
                    totalBids += 1;
                  }
                });
              });
            });

            const bidPrize =
              calculateCurrentPrize(totalAmountInRange) + totalBidsInRange >
                25 && (totalBidsInRange - 25) * 1000;
            return {
              ...user,
              totalAmountInRange,
              totalBidsInRange,
              bidPrize,
              totalAmount,
              totalBids,
            };
          })
          .sort((a, b) => b.totalAmountInRange - a.totalAmountInRange)
      );
    };

    const rawTableData = sumUsersCargos(
      joinData.data,
      userList as StatsUserList[]
    );

    const leaderUserSum = findMaxValue(rawTableData);

    const totalPrize = rawTableData.reduce((acc, curr) => {
      return acc + curr.totalAmountInRange;
    }, 0);

    const newData = rawTableData.map((item) => {
      return {
        ...item,
        totalAmount: getSeparatedNumber(item.totalAmount),
        totalAmountInRange: getSeparatedNumber(item.totalAmountInRange),
        prizeSum: getSeparatedNumber(
          item.bidPrize && calculateCurrentPrize(totalPrize) > 0
            ? Math.round(calculateCurrentPrize(totalPrize) + item.bidPrize)
            : 0
        ),
        leadUserSum:
          item.totalAmountInRange == leaderUserSum ? leaderUserSum : 0,
      };
    });
    setTableData(newData as StatsUserList[]);
  };

  useEffect(() => {
    if (isJoinFetched && joinData) {
      handleSetWeekFilter();
    }
  }, [weekNum, joinData, isJoinFetched]);

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
          <CustomWeekSelector setWeekNum={setWeekNum} />
        </div>
      </div>
    </div>
  );
}
