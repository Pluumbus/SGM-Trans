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
  ModalHeader,
  useDisclosure,
  ModalBody,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { rolesList, UsersList } from "../_feature/types";
import { useUser } from "@clerk/nextjs";
import { Input } from "postcss";
import { useState } from "react";

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
      const { isOpen, onOpen, onOpenChange } = useDisclosure();
      const [role, setRole] = useState<string>("");
      const [balance, setBalance] = useState<string>("");
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonCn variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </ButtonCn>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Button onPress={onOpen} variant="light">
                Выдать роль
              </Button>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalBody>
                        <input
                          type="text"
                          placeholder="Введите роль"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        />
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button onPress={onOpen} variant="light">
                Обновить баланс
              </Button>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalBody>
                        <input
                          type="text"
                          placeholder="Введите баланс"
                          value={role}
                          onChange={(e) => setBalance(e.target.value)}
                        />
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// function AssingRole(userId: string, role: string) {
//   const { mutate: setRoleMutation } = useMutation({
//     mutationKey: ["setRole"],
//     mutationFn: async () => {
//       const response = await fetch("/api/setRole", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role }),
//       });
//       if (response.ok) {
//         alert("Роль выдана");
//       } else {
//         console.log(response);
//         alert("Произошла непредвиденная ошибка");
//       }
//     },
//   });
// }
// function AssignBalance(userId: string, balance: string) {
//   const { mutate: setBalanceMutation } = useMutation({
//     mutationKey: ["setBalance"],
//     mutationFn: async () => {
//       const response = await fetch("/api/setBalance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, balance }),
//       });
//       if (response.ok) {
//         alert("Баланс пополнен");
//       } else {
//         console.log(response);
//         alert("Произошла непредвиденная ошибка");
//       }
//     },
//   });
// }
