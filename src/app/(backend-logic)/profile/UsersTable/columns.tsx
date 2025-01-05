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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Avatar,
  Modal,
  Tooltip,
  Button,
  ModalContent,
  ModalBody,
  Autocomplete,
  AutocompleteItem,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { UsersList } from "../../../../lib/references/clerkUserType/types";
import { Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import React from "react";
import { BiSend } from "react-icons/bi";
import { setUserData } from "../../../../lib/references/clerkUserType/SetUserFuncs";
import { useToast } from "@/components/ui/use-toast";
import { roleNamesList } from "@/components/RoleManagment/useRole";

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
    header: ({ column }) => {
      return (
        <Tooltip content="Фильтр ролей">
          <Button
            variant="light"
            className=""
            onPress={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            <h1>Роль</h1>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Tooltip>
      );
    },
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },
  {
    accessorKey: "balance",
    header: "Баланс",
    cell: ({ row }) => {
      return row.original.balance || 0;
    },
  },
  {
    accessorKey: "time",
    header: "Время",
    cell: ({ row }) => {
      const seconds = row.original.time;
      const prevTime = row.original.prevTime;
      if (row.original.role == "Логист Дистант") {
        if (row.original.time == undefined || null) {
          return "";
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        const prevHours = Math.floor(prevTime / 3600);
        const prevMinutes = Math.floor((prevTime % 3600) / 60);

        return (
          <div>
            <p>
              {hours}ч {minutes}м
            </p>
            <p className="text-gray-500 text-xs">
              {prevHours}ч {prevMinutes}м
            </p>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "actions",
    header: "Действия",
    cell: ({ row }) => {
      const [isOpenRole, setIsOpenRole] = useState(false);
      const [isOpenBalance, setIsOpenBalance] = useState(false);
      const [role, setRole] = useState(row.original.role);
      const [balance, setBalance] = useState(row.original.balance || 0);
      const [userId, setUserId] = useState("");
      const { toast } = useToast();

      const { mutate: setRoleMutation } = useMutation({
        mutationKey: ["SetUserData"],
        mutationFn: async () =>
          await setUserData({
            userId,
            publicMetadata: {
              balance,
              role,
              time: row.original.time != null ? row.original.time : 0,
              prevTime:
                row.original.prevTime != null ? row.original.prevTime : 0,
            },
          }),
        onSuccess() {
          toast({
            title: `Вы успешно обновили данные для ${row.original.userName}`,
          });
        },
        onError(e) {
          toast({
            title: "Ошибка",
            description: `${e}`,
          });
        },
      });

      const handleSetRole = (e: FormEvent, userId: string) => {
        e.preventDefault();
        setUserId(userId);
        setRoleMutation();
      };
      const onInputChange = (value) => {
        setRole(value);
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
                <Button onPress={() => setIsOpenRole(true)} variant="light">
                  Выдать роль
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button onPress={() => setIsOpenBalance(true)} variant="light">
                  Обновить баланс
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Modal isOpen={isOpenRole} onOpenChange={() => setIsOpenRole(false)}>
            <ModalContent>
              <ModalHeader>
                Изменить роль для {row.original.userName}
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => handleSetRole(e, row.original.id)}
                  className="flex flex-col gap-4"
                >
                  <Autocomplete
                    label="Введите роль"
                    className="max-w-xs  max-h-xs h-2/4"
                    onInputChange={onInputChange}
                  >
                    {roleNamesList.map((role: string) => (
                      <AutocompleteItem key={role}>{role}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <div className="flex justify-between">
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => setIsOpenRole(false)}
                    >
                      Закрыть
                    </Button>
                    <Button
                      type="submit"
                      color="success"
                      variant="light"
                      onPress={() => setIsOpenRole(false)}
                    >
                      Подтвердить
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isOpenBalance}
            onOpenChange={() => setIsOpenBalance(false)}
          >
            <ModalContent>
              <ModalHeader>
                Изменить баланс для {row.original.userName}
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => handleSetRole(e, row.original.id)}
                  className="flex flex-col gap-4 "
                >
                  <Input
                    type="text"
                    placeholder="Введите баланс"
                    value={String(balance)}
                    onChange={(e) => setBalance(Number(e.target.value) || 0)}
                    className="w-1/2"
                  />
                  <div className="flex justify-between">
                    <Button
                      variant="light"
                      color="danger"
                      onPress={() => setIsOpenBalance(false)}
                    >
                      Закрыть
                    </Button>
                    <Button
                      type="submit"
                      variant="light"
                      color="success"
                      onPress={() => setIsOpenBalance(false)}
                    >
                      Подтвердить
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      );
    },
  },
];
