/* eslint-disable prettier/prettier */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button as ButtonCn } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Avatar,
  Modal,
  Button,
  ModalContent,
  ModalBody,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { roleNamesList, rolesList, UsersList } from "../_feature/types";
import { useUser } from "@clerk/nextjs";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import React from "react";

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
      return (row.original.balance == "" || undefined) ?? "0";
    },
  },
  {
    accessorKey: "actions",
    header: "Действия",
    cell: ({ row }) => {
      const [isOpenRole, setIsOpenRole] = useState(false);
      const [isOpenBalance, setIsOpenBalance] = useState(false);
      const [role, setRole] = useState(row.original.role);
      const [balance, setBalance] = useState(row.original.balance);
      const [userId, setUserId] = useState("");

      const { mutate: setRoleMutation } = useMutation({
        mutationKey: ["setRole"],
        mutationFn: async () => {
          const response = await fetch("/api/setRole", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, role, balance }),
          });
          if (response.ok) {
            alert("Роль выдана");
          } else {
            console.log(response);
            alert("Произошла непредвиденная ошибка");
          }
        },
      });
      const { mutate: setBalanceMutation } = useMutation({
        mutationKey: ["setBalance"],
        mutationFn: async () => {
          const response = await fetch("/api/setBalance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, role, balance }),
          });
          if (response.ok) {
            alert("Баланс обновлен");
          } else {
            console.log(response);
            alert("Произошла непредвиденная ошибка");
          }
        },
      });
      const handleSetRole = (userId: string) => {
        setUserId(userId);
        setRoleMutation();
      };
      const onInputChange = (value) => {
        setRole(value);
      };
      const handleSetBalance = (userId: string) => {
        setUserId(userId);
        setBalanceMutation();
      };
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonCn variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Открыть меню</span>
                <MoreHorizontal className="h-4 w-4" />
              </ButtonCn>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Button onClick={() => setIsOpenRole(true)} variant="light">
                  Выдать роль
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button onClick={() => setIsOpenBalance(true)} variant="light">
                  Обновить баланс
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Modal
            isOpen={isOpenRole}
            onOpenChange={() => setIsOpenRole(false)}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              <ModalBody>
                <form
                  onSubmit={() => handleSetRole(row.original.id)}
                  className="w-2/3"
                >
                  {/* <Input
                    type="text"
                    placeholder="Введите роль"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  /> */}
                  <Autocomplete
                    label="Введите роль"
                    className="max-w-xs"
                    onInputChange={onInputChange}
                  >
                    {roleNamesList.map((role: string) => (
                      <AutocompleteItem key={role}>{role}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isOpenBalance}
            onOpenChange={() => setIsOpenBalance(false)}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              <ModalBody>
                <form
                  onSubmit={() => handleSetBalance(row.original.id)}
                  className="w-2/3"
                >
                  <Input
                    type="text"
                    placeholder="Введите баланс"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      );
    },
  },
];
