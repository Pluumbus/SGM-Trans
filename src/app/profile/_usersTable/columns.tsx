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
import { UsersList } from "../../../lib/references/roles/types";
import { Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import React from "react";
import { BiSend } from "react-icons/bi";
import { setUserData } from "../../../components/roles/setUserData";
import { useToast } from "@/components/ui/use-toast";
import { roleNamesList } from "@/lib/references/roles/roles";

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
  },
  {
    accessorKey: "balance",
    header: "Баланс",
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
      const [balance, setBalance] = useState(row.original.balance);
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

          <Modal isOpen={isOpenRole} onOpenChange={() => setIsOpenRole(false)}>
            <ModalContent>
              <ModalBody>
                <form
                  onSubmit={(e) => handleSetRole(e, row.original.id)}
                  className="flex"
                >
                  <Autocomplete
                    label="Введите роль"
                    className="max-w-xs w-2/4 max-h-xs h-2/4"
                    onInputChange={onInputChange}
                  >
                    {roleNamesList.map((role: string) => (
                      <AutocompleteItem key={role}>{role}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <div className="max-w-xs ml-5">
                    <Button type="submit" isIconOnly size="lg" variant="light">
                      <BiSend />
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
              <ModalBody>
                <form
                  onSubmit={(e) => handleSetRole(e, row.original.id)}
                  className="w-2/3 flex"
                >
                  <Input
                    type="text"
                    placeholder="Введите баланс"
                    value={String(balance)}
                    onChange={(e) => setBalance(Number(e.target.value) || 0)}
                  />
                  <div className="max-w-xs ml-5">
                    <Button type="submit" isIconOnly variant="light">
                      <BiSend />
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
