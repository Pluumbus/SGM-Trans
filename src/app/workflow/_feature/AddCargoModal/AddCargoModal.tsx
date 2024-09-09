import { useToast } from "@/components/ui/use-toast";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
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
} from "@nextui-org/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { addCargo } from "../WeekCard/requests";
import { CargoType } from "../types";
import { Cities, DriversWithCars } from "@/lib/references";
import { parseDate } from "@internationalized/date";

export const CargoModal = ({
  isOpenCargo,
  onOpenChangeCargo,
  trip_id,
}: {
  trip_id: number;
  isOpenCargo: boolean;
  onOpenChangeCargo: () => void;
}) => {
  const { toast } = useToast();
  const { register, handleSubmit, control, setValue } = useForm<CargoType>();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CargoType) => await addCargo(data),
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Вы успешно добавили груз",
      });
      onOpenChangeCargo();
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не получилось добавить груз",
      });
    },
  });
  const onSubmit = (data: CargoType) => {
    mutate({
      ...data,
      trip_id: trip_id,
      arrival_date:
        `${data.arrival_date.year}-${data.arrival_date.month}-${data.arrival_date.day}` ||
        1,
    });
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
              <Controller
                control={control}
                name="unloading_city"
                render={({ field }) => (
                  <Cities
                    selectedKey={field.value}
                    onSelectionChange={(e) => {
                      setValue("unloading_city", e.toString());
                    }}
                  />
                )}
              />

              <Input {...register("weight")} label="Вес" />
              <Input {...register("volume")} label="Объем" />
              <Controller
                control={control}
                name="quantity"
                render={({ field }) => (
                  <div className="flex gap-2 ">
                    <Input
                      value={field.value?.value}
                      label="Количество"
                      onChange={(e) => {
                        setValue("quantity.value", e.target.value);
                        console.log(field);
                      }}
                    />
                    <Autocomplete
                      selectedKey={field.value?.key}
                      label="Коробки / палеты"
                      defaultSelectedKey={"Коробки"}
                      onSelectionChange={(e) => {
                        setValue("quantity.key", e);
                        console.log(field.value);
                      }}
                    >
                      <AutocompleteItem key={"Палеты"} textValue="Палеты">
                        Палеты
                      </AutocompleteItem>
                      <AutocompleteItem key={"Коробки"} textValue="Коробки">
                        Коробки
                      </AutocompleteItem>
                    </Autocomplete>
                  </div>
                )}
              />

              <Input {...register("amount")} label="Сумма тг." />
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
                label="Плательщик (Менеджер ведущий перевозку)"
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
              <Input {...register("status")} label="Дата принятия груза" />
              {/* TODO: сделать Date picker */}
              <Controller
                control={control}
                name="arrival_date"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    label="Планируемая дата доставки"
                  />
                )}
              />

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
            <Button
              variant="flat"
              color="success"
              type="submit"
              isLoading={isPending}
            >
              Добавить груз
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
