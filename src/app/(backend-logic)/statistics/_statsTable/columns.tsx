"use client";
import { StatsUserList } from "@/lib/references/stats/types";
import { getSeparatedNumber, useNumberState } from "@/tool-kit/hooks";
import { CrownText } from "@/tool-kit/ui";
import { Avatar } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { isKzUser } from "../../profile/feature/ProfileButton/Prize/Prize";

export const columns: ColumnDef<StatsUserList>[] = [
  {
    accessorKey: "user_id",
    header: "Пользователь",
    cell: (info) => {
      const { row } = info;
      return (
        <div>
          <Avatar src={row.original.avatar} />
          {row.original.leadUserSum !== 0 ? (
            <CrownText text={row.original.userName} w={28} h={28} />
          ) : (
            row.original.userName
          )}
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
    id: "prizeSum",
    header: "Премия за неделю",
    cell: ({ cell }) => {
      const { row } = cell;

      if (row.original.user_id === "user_2q43LAICTieWjrQavnXs5wNbQsc") {
        return row.original.totalBidsInRange * 100;
      }
      if (row.original.role === "Логист Москва") {
        if (row.original.user_id === "user_2q4308qq9oDBR0iOG6TGOMhavUx") {
          return (
            (Number(row.original.totalAmountInRange.replace(/,/g, "")) * 3) /
            100
          );
        }
        return 0;
      } else {
        return row.original.prizeSum;
      }
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Общая сумма тг.",
  },
  {
    accessorKey: "totalBids",
    header: "Общая сумма заявок",
  },

  {
    accessorKey: "role",
    cell: ({ column }) => {
      column.setFilterValue("Логист");
      column.toggleVisibility(false);
    },
  },
];
