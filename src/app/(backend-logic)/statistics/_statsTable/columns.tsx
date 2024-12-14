"use client";
import { ProfilePrize } from "@/components/ui/ProfileButton/Prize/Prize";
import { calculateCurrentPrize } from "@/components/ui/ProfileButton/Prize/PrizeFormula";
import { StatsUserList } from "@/lib/references/stats/types";
import { useNumberState } from "@/tool-kit/hooks";
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
    header: "Сумма тг. за неделю",
  },
  {
    accessorKey: "totalBidsInRange",
    header: "Сумма заявок за неделю",
  },
  {
    accessorKey: "prizeSum",
    header: "Премия за неделю",
  },
  {
    accessorKey: "amount",
    header: "Общая сумма тг.",
    cell: ({ row }) => {
      let salesSum = 0;
      row.original.value.forEach((sale) => {
        salesSum += Number(sale);
      });
      let output = useNumberState({ initValue: salesSum, separator: "," });
      return output.value;
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
];
