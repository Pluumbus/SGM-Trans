import { useToast } from "@/components/ui/use-toast";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Calendar,
  Checkbox,
  DateInput,
  DatePicker,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { addCargo } from "../requests";
import { CargoType } from "../../types";

export const CargoModal = ({
  isOpenCargo,
  onOpenChangeCargo,
}: {
  isOpenCargo: boolean;
  onOpenChangeCargo: () => void;
}) => {
  const { toast } = useToast();
  const { register, handleSubmit, control } = useForm<CargoType>();

  const { mutate } = useMutation({
    mutationFn: async (data: CargoType) => await addCargo(data),
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Вы успешно добавили груз",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не получилось добавить груз",
      });
    },
  });
  const onSubmit = (data: CargoType) => {
    mutate({ ...data, arrival_date: data.arrival_date.toString() });
  };

  return (
    <Modal isOpen={isOpenCargo} onOpenChange={onOpenChangeCargo} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Добавить груз</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Input {...register("receipt_address")} label="Адрес получения" />
              <Input {...register("unloading_city")} label="Город разгрузки" />
              <Input {...register("weight")} label="Вес" />
              <Input {...register("volume")} label="Объем" />
              <Input {...register("quantity")} label="Количество" />

              <Input {...register("amount")} label="Сумма" />
              <Controller
                control={control}
                name="is_unpalletizing"
                render={({ field }) => (
                  <Checkbox {...field} type="checkbox">
                    Распалечиваем
                  </Checkbox>
                )}
              />
              <Input {...register("comments")} label="Комментарии" />
              <Input {...register("client_name")} label="Имя клиента" />
              <Input {...register("client_bin")} label="БИН клиента" />
              <Input {...register("cargo_name")} label="Название груза" />
              <Input {...register("payer")} label="Плательщик" />
              <Input
                {...register("transportation_manager")}
                label="Менеджер по перевозкам"
              />
              <Controller
                control={control}
                name="is_documents"
                render={({ field }) => (
                  <Checkbox {...field} type="checkbox">
                    Наличие документов
                  </Checkbox>
                )}
              />
              <Input {...register("status")} label="Статус" />
              <Controller
                control={control}
                name="arrival_date"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    label="Дата прибытия"
                  />
                )}
              />
              <Input {...register("sgm_manager")} label="Менеджер SGM" />
              <Input {...register("payment")} label="Оплата" />
              <Input {...register("loading_scheme")} label="Схема загрузки" />
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              variant="light"
              color="danger"
              onClick={() => {
                onOpenChangeCargo();
              }}
            >
              Отмена
            </Button>
            <Button variant="flat" color="success" type="submit">
              Добавить груз
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
