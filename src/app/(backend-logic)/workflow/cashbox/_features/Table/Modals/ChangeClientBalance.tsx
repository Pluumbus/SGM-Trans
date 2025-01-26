import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { changeClientBalance } from "../../api";
import { Cell } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";
import { useNumberState } from "@/tool-kit/hooks";
import { CashboxTableType } from "@/lib/types/cashbox.types";

export const ChangeClientBalance = ({
  disclosure,
  info,
}: {
  disclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
  info: Cell<CashboxTableType, ReactNode>;
}) => {
  const [balance, setBalance] = useState<{
    value: string;
    isInvalid: boolean;
  }>({
    value: "",
    isInvalid: false,
  });

  const formattedBalance = useNumberState({
    separator: ",",
  });

  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await changeClientBalance(
        info.row.original.id,
        Number(info.row.original.current_balance) + formattedBalance.rawValue
      ),
    onSuccess: () => {
      toast({
        title: `Успех`,
        description: `Вы успешно обновили баланс для ${info.row.original.client}`,
      });
      disclosure.onOpenChange();
    },
    onError: () => {
      toast({
        title: `Ошибка`,
        description: `Не удалось обновить баланс для ${info.row.original.client}`,
      });
    },
  });

  const validation = () => {
    setBalance((prev) => ({
      ...prev,
      isInvalid: formattedBalance.value.trim() == "",
    }));
    if (formattedBalance.value.trim() !== "") {
      mutate();
    }
  };
  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validation();
          }}
        >
          <ModalHeader className="flex flex-col gap-1">
            Добавить баланс клиенту
          </ModalHeader>
          <Divider />
          <ModalBody>
            <Input
              autoFocus
              errorMessage="Добавьте баланс"
              isInvalid={formattedBalance.rawValue < 0}
              label="Добаленный баланс"
              value={formattedBalance.value}
              onChange={(e) => {
                formattedBalance.onChange(e);
                console.log("e.target.value", e.target.value);
                console.log("formattedBalance.value", formattedBalance.value);
                console.log(
                  "formattedBalance.rawValue",
                  formattedBalance.rawValue
                );
              }}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                disclosure.onOpenChange();
              }}
              isLoading={isPending}
            >
              Закрыть
            </Button>
            <Button color="success" type="submit" isLoading={isPending}>
              Добавить
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
