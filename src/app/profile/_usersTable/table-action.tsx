import { ColumnDef, Row } from "@tanstack/react-table";
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
  Modal,
  Button,
  ModalContent,
  ModalBody,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { roleNamesList, UsersList } from "../../../components/roles/types";
import { Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import React from "react";
import { BiSend } from "react-icons/bi";

export const ActionRow = (row: { row: Row<UsersList> }) => {
  const rowVal = row.row.original;
  const [isOpenRole, setIsOpenRole] = useState(false);
  const [isOpenBalance, setIsOpenBalance] = useState(false);
  const [role, setRole] = useState(rowVal.role);
  const [balance, setBalance] = useState(rowVal.balance);
  const [userId, setUserId] = useState("");

  const { mutate: setRoleMutation } = useMutation({
    mutationKey: ["setMetadata"],
    mutationFn: async () => {
      const response = await fetch("/api/setMetadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, balance }),
      });
      console.log(userId, role, balance);
      if (response.ok) {
        alert("Роль выдана");
      } else {
        console.log(response);
        alert("Произошла непредвиденная ошибка");
      }
    },
  });

  //   const { mutate: setBalanceMutation } = useMutation({
  //     mutationKey: ["setBalance"],
  //     mutationFn: async () => {
  //       const response = await fetch("/api/setBalance", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ userId, role, balance }),
  //       });
  //       if (response.ok) {
  //         alert("Баланс обновлен");
  //       } else {
  //         console.log(response);
  //         alert("Произошла непредвиденная ошибка");
  //       }
  //     },
  //   });
  const handleSetRole = (e: FormEvent, userId: string) => {
    e.preventDefault();
    setUserId(userId);
    setRoleMutation();
  };
  const onInputChange = (value) => {
    setRole(value);
  };
  //   const handleSetBalance = (userId: string) => {
  //     setUserId(userId);
  //     setBalanceMutation();
  //   };
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
              onSubmit={(e) => handleSetRole(e, rowVal.id)}
              className="w-2/3 flex"
            >
              <Autocomplete
                label="Введите роль"
                className="max-w-xs"
                onInputChange={onInputChange}
              >
                {roleNamesList.map((role: string) => (
                  <AutocompleteItem key={role}>{role}</AutocompleteItem>
                ))}
              </Autocomplete>
              <div className="max-w-xs">
                <Button type="submit" isIconOnly>
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
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          <ModalBody>
            <form
              onSubmit={(e) => handleSetRole(e, rowVal.id)}
              className="w-2/3 flex"
            >
              <Input
                type="text"
                placeholder="Введите баланс"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
              <Button type="submit" isIconOnly>
                <BiSend />
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};