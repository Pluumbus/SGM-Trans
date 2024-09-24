"use client";
import { StatsUserList } from "@/lib/references/stats/types";
import { Avatar } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<StatsUserList>[] = [
  {
    accessorKey: "user_id",
    header: "Пользователь",
    cell: ({ row }) => {
      return (
        <div>
          <Avatar src={row.original.avatar} />
          {row.original.userName}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Сумма тг. за промежуток",
    cell: ({ row }) => {
      let salesSum = 0;
      row.original.amount.forEach((sale) => {
        salesSum += Number(sale);
      });
      return salesSum;
    },
  },
  {
    accessorKey: "bidSum",
    header: "Сумма заявок за промежуток",
  },
  {
    accessorKey: "role",
    header: "Роль",
    cell: ({ column }) => {
      column.setFilterValue("Логист");
      column.toggleVisibility(false);
    },
  },
  {
    accessorKey: "created_at",
    header: "Дата",
    filterFn: (row, a, filterValue) => {
      const dates = row.original.created_at;
      const [startDate, endDate] = filterValue;
      // console.log(startDate, endDate);
      // console.log(dates);

      if (!Array.isArray(dates) || dates.length === 0) return false;
      const filteredDates = dates.map((date) => {
        return date >= startDate && date <= endDate;
      });
      console.log(filteredDates);
      // return dates.every((dateStr) => {
      //   console.log(`Illarion ${dateStr}`);
      //   const date = new Date(dateStr);
      //   return date >= new Date(startDate) && date <= new Date(endDate);
      // });
    },
    // cell: ({ row, column }) => {
    //   //  column.toggleVisibility(false);
    //   return <>{row.original.created_at as Date[]}</>;
    // },
  },
];
