import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { CashboxType } from "../../../types";
import { Cell } from "@tanstack/react-table";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changeClientPaymentTerms } from "../../api";
import { useToast } from "@/components/ui/use-toast";

type PropsType = {
  info: Cell<CashboxType, React.ReactNode>;
  disclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
};

export const ChangePaymentTerms = ({ info, disclosure }: PropsType) => {
  const [state, setState] = useState();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await changeClientPaymentTerms(info.row.original.id, state),
    onSuccess: () => {
      toast({
        title: `Успех`,
        description: `Вы успешно обновили допустимый срок оплаты для ${info.row.original.client.full_name.first_name} ${info.row.original.client.full_name.last_name}`,
      });
      disclosure.onOpenChange();
    },
    onError: () => {
      toast({
        title: `Ошибка`,
        description: `Не удалось изменить допустимый срок оплаты для ${info.row.original.client.full_name.first_name} ${info.row.original.client.full_name.last_name}`,
      });
    },
  });
  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        <ModalHeader>Изменить допустимую задержку оплаты</ModalHeader>
        <Divider />
        <ModalBody>
          <Autocomplete
            selectedKey={state}
            onSelectionChange={(e) => {
              setState[e];
            }}
          >
            {PAYMENT_TERMS.map((e) => (
              <AutocompleteItem
                key={e.hrs}
                textValue={e.textValue}
                value={e.hrs}
              >
                {e.textValue}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </ModalBody>
        <Divider />
        <ModalFooter className="flex gap-2">
          <Button
            color="danger"
            variant="light"
            onClick={() => {
              mutate;
            }}
            isLoading={isPending}
          >
            Закрыть
          </Button>
          <Button
            color="success"
            onClick={() => {
              mutate();
            }}
            isLoading={isPending}
          >
            Изменить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const PAYMENT_TERMS = [
  {
    textValue: "1 день",
    hrs: 24,
  },
  {
    textValue: "7 дней",
    hrs: 24 * 7,
  },
  {
    textValue: "14 дней",
    hrs: 14 * 24,
  },
  {
    textValue: "21 день",
    hrs: 21 * 24,
  },
  {
    textValue: "30 дней",
    hrs: 30 * 24,
  },
] as const;
