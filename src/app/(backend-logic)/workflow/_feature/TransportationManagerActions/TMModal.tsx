import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { CargoType } from "../types";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "./api";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmContext } from "@/tool-kit/hooks";
import { str } from "./TM";
import { CashboxType } from "../../cashbox/types";

type TM = CashboxType["client"];

interface Props {
  disclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
  state: [number, React.Dispatch<React.SetStateAction<number>>];
}
export const TMModal = ({ disclosure, state }: Props) => {
  const { register, getValues } = useForm<TM>();

  const { toast } = useToast();
  const { openModal } = useConfirmContext();

  const { mutate, isPending } = useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      console.log("success: ", data);

      toast({
        title: "Вы успешно добавили клиента",
        description: `${getValues().full_name.first_name} ${getValues().full_name.last_name} c номером: ${getValues().phone_number}`,
      });
      disclosure.onOpenChange();
      state[1]((data[0] as CashboxType).id);
    },
    onError: (err) => {
      toast({
        title: "Ошибка",
        description: `${err.message}`,
      });
    },
  });

  const onSubmit = () => {
    const data = getValues();
    openModal({
      action: async () => mutate(data),
      title: "Вы уверены что хотите добавить пользователя?",
      description: (
        <span className="font-semibold text-medium text-danger text-center">
          Это действие невозможно будет отменить
        </span>
      ),
      isLoading: isPending,
    });
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      backdrop="blur"
      size="3xl"
    >
      <ModalContent>
        <form>
          <ModalHeader>Добавить клиента</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="grid grid-cols-2 gap-2">
              <Input {...register("full_name.first_name")} label="Имя" />
              <Input {...register("full_name.last_name")} label="Фамилия" />
              <Input
                {...register("full_name.middle_name")}
                label="Отчество (опционально)"
              />
              <Input {...register("phone_number")} label="Номер телефона" />
              <Textarea
                {...register("company_name")}
                label="Компания (опционально)"
              />
              <Textarea {...register("comment")} label="Заметка" />
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button variant="light" color="danger" isLoading={isPending}>
              Отмена
            </Button>
            <Button
              variant="flat"
              color="success"
              isLoading={isPending}
              onClick={() => {
                onSubmit();
              }}
            >
              Добавить клиента
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};