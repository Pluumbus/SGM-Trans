"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Avatar } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { rolesList, UsersList } from "../_feature/types";
import { useUser } from "@clerk/nextjs";

export const columns: ColumnDef<UsersList>[] = [
  {
    accessorKey: "userName",
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
    accessorKey: "email",
    header: "Почта",
  },
  {
    accessorKey: "role",
    header: "Роль",
    cell: ({ row }) => {
      const { user } = useUser();
      const role = user?.publicMetadata?.role as string | undefined;
      return row.original.role == undefined ? "Пользователь" : rolesList[role!];
    },
  },
  {
    accessorKey: "balance",
    header: "Баланс",
    cell: ({ row }) => {
      return row.original.balance ?? "0";
    },
  },
  {
    accessorKey: "actions",
    header: "Действия",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.role)}
            >
              Выдать роль
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.balance)}
            >
              Обновить баланс
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AssingRole(userId: string, role: string) {
  const { mutate: setRoleMutation } = useMutation({
    mutationKey: ["setRole"],
    mutationFn: async () => {
      const response = await fetch("/api/setRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (response.ok) {
        alert("Роль выдана");
      } else {
        console.log(response);
        alert("Произошла непредвиденная ошибка");
      }
    },
  });
}
function AssignBalance(userId: string, balance: string) {
  const { mutate: setBalanceMutation } = useMutation({
    mutationKey: ["setBalance"],
    mutationFn: async () => {
      const response = await fetch("/api/setBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, balance }),
      });
      if (response.ok) {
        alert("Баланс пополнен");
      } else {
        console.log(response);
        alert("Произошла непредвиденная ошибка");
      }
    },
  });
}
