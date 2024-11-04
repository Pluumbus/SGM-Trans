import { useToast } from "@/components/ui/use-toast";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { addCargo } from "../WeekCard/requests";
import { CargoType } from "../types";
import {
  Cities,
  DriversWithCars,
  PRICE_TYPE,
  QUANTITY_TYPE,
  QuantityType,
} from "@/lib/references";

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
  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<CargoType>();

  const [withDelivery, driverID, amountType, quantityType] = watch([
    "unloading_point.withDelivery",
    "driver.id",
    "amount.type",
    "quantity.type",
  ]);

  const { mutate, isPending } = useMutation({
    mutationFn: addCargo,
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Вы успешно добавили груз",
      });
      onOpenChangeCargo();
      reset();
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description:
          "Не получилось добавить груз, проверьте поле 'сумма оплаты'",
      });
    },
  });
  const onSubmit = (data: CargoType) => {
    const unlPoint = data.unloading_point?.city
      ? data.unloading_point
      : {
          city: "",
          withDelivery: false,
          deliveryAddress: "",
        };
    mutate({
      ...data,
      trip_id: trip_id,
      client_bin: {
        snts: ["KZ-SNT-"],
        tempText: data.client_bin.tempText || "",
        xin: "",
      },
      unloading_point: unlPoint,
      status: data.status?.year
        ? `${data.status.year}-${data.status.month}-${data.status.day}`
        : `${new Date().toISOString().split("T")[0]}`,
    });
  };

  return (
    <Modal isOpen={isOpenCargo} onOpenChange={onOpenChangeCargo} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Добавить груз</ModalHeader>
          <Divider />
          <ModalBody className="transition-all">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Textarea
                {...register("receipt_address")}
                label="Адрес получения груза"
              />
              <Textarea
                {...register("client_bin.tempText")}
                label={`Клиент\n\n(получатель груза)\n\nБИН`}
              />

              {withDelivery ? (
                <div className="flex items-start">
                  <div className="flex gap-2 items-center">
                    <Controller
                      control={control}
                      name="unloading_point.city"
                      render={({ field }) => (
                        <Cities
                          selectedKey={field.value}
                          onSelectionChange={(e) => {
                            setValue("unloading_point.city", e.toString());
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="unloading_point.withDelivery"
                      render={({ field }) => (
                        <Checkbox {...field} isSelected={withDelivery}>
                          С&nbsp;доставкой
                        </Checkbox>
                      )}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <Controller
                    control={control}
                    name="unloading_point.city"
                    render={({ field }) => (
                      <Cities
                        selectedKey={field.value}
                        onSelectionChange={(e) => {
                          setValue("unloading_point.city", e.toString());
                        }}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="unloading_point.withDelivery"
                    render={({ field }) => (
                      <Checkbox {...field} isSelected={withDelivery}>
                        С&nbsp;доставкой
                      </Checkbox>
                    )}
                  />
                </>
              )}

              {withDelivery && (
                <Textarea
                  {...register("unloading_point.deliveryAddress")}
                  label={`Адрес доставки`}
                />
              )}

              <div className="flex gap-2">
                <Input {...register("weight")} label="Вес" />
                <Input {...register("volume")} label="Объем" />
              </div>

              <Controller
                control={control}
                name="quantity"
                render={({ field }) => (
                  <div className="flex gap-2 ">
                    <Input
                      label="Количество"
                      // value={field.value?.value}
                      // onChange={(e) => {
                      //   setValue("quantity.value", e.target.value);
                      // }}
                      {...register("quantity.value")}
                    />
                    <Autocomplete
                      label="Коробки / палеты"
                      selectedKey={quantityType}
                      onSelectionChange={(e) => {
                        setValue("quantity.type", e as QuantityType);
                      }}
                    >
                      {QUANTITY_TYPE.map((e) => (
                        <AutocompleteItem key={e} textValue={e}>
                          {e}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                )}
              />

              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <div className="flex gap-2 ">
                    <Input
                      label="Сумма оплаты (тг.)"
                      // value={field.value?.value}
                      // onChange={(e) => {
                      //   setValue("amount.value", e.target.value);
                      // }}
                      {...register("amount.value")}
                    />
                    <Autocomplete
                      label="Способ оплаты"
                      selectedKey={amountType}
                      onSelectionChange={(e) => {
                        setValue("amount.type", e);
                      }}
                    >
                      {PRICE_TYPE.map((e) => (
                        <AutocompleteItem key={e} textValue={e}>
                          {e}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                )}
              />

              <Input {...register("cargo_name")} label="Название груза" />
              <Controller
                control={control}
                name="is_unpalletizing"
                render={({ field }) => (
                  <Checkbox {...field} type="checkbox">
                    Распалечиваем
                  </Checkbox>
                )}
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

              <div className="col-span-2 flex gap-2 justify-between">
                <Textarea
                  {...register("comments")}
                  label="Комментарии"
                  className="w-1/3"
                />

                <Textarea
                  {...register("transportation_manager")}
                  label="Плательщик (Менеджер ведущий перевозку)"
                  className="w-2/3"
                />
              </div>

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    label="Дата поступления на склад"
                  />
                )}
              />

              <Input {...register("loading_scheme")} label="Схема погрузки" />
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
