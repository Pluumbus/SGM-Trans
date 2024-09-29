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
    accessorKey: "totalAmountInRange",
    header: "Сумма тг. за промежуток",
  },
  {
    accessorKey: "totalBidsInRange",
    header: "Сумма заявок за промежуток",
  },
  {
    accessorKey: "amount",
    header: "Общая сумма тг.",
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
    header: "Общая сумма заявок",
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
    cell: ({ column }) => {
      column.toggleVisibility(false);
    },
  },
];
