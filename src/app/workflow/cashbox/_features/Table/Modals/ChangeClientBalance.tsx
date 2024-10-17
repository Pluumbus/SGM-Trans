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
import { CashboxType } from "../../../types";
import { useToast } from "@/components/ui/use-toast";

export const ChangeClientBalance = ({
  disclosure,
  info,
}: {
  disclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
  info: Cell<CashboxType, ReactNode>;
}) => {
  const [balance, setBalance] = useState<{
    value: string;
    isInvalid: boolean;
  }>({
    value: "",
    isInvalid: false,
  });
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await changeClientBalance(
        info.row.original.id,
        Number(balance.value.trim())
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
      isInvalid: balance.value.trim() == "",
    }));
    if (balance.value.trim() !== "") {
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
              errorMessage="Добавьте баланс"
              isInvalid={balance.isInvalid}
              label="Добаленный баланс"
              value={balance.value}
              onChange={(e) => {
                setBalance((prev) => ({
                  ...prev,
                  value: e.target.value,
                }));
              }}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => {
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
