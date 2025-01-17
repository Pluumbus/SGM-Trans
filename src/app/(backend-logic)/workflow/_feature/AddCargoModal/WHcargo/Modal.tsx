import {
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
  useDisclosure,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { WHCargoType } from "./types";
import { Cities, DriversWithCars } from "@/lib/references";
import { useMutation } from "@tanstack/react-query";
import { addWHCargo, updateWHCargo } from "./api";
import { useToast } from "@/components/ui/use-toast";
import { BINInput } from "../../BINInput/BINInput";
import { UDatePicker } from "@/tool-kit/U";
import { useEffect } from "react";
import { useUpdateCargoContext } from "../../../[slug]/week/[weekId]/trip/[id]/_features/UpdateCargo";
import { prefillWHCargo } from "./helpers";

export const WHCargoModal = ({
  disclosure,
  trip_id,
  mode = "Create",
}: {
  disclosure: ReturnType<typeof useDisclosure>;
  trip_id?: number;
  mode?: "Update" | "Create";
}) => {
  const { whRow: row } = useUpdateCargoContext();
  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<WHCargoType>();

  const [withDelivery, driver] = watch([
    "unloading_point.withDelivery",
    "driver",
  ]);
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: addWHCargo,
    onSuccess: () => {
      toast({
        title: "Вы успешно создали груз",
        description:
          "На данный момент, ваш груз сохранен, но не действиетелен. Подождите пока логист добавит его",
      });
      reset();
      disclosure.onOpenChange();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `${error.message}`,
      });
    },
  });

  const { mutate: updateWHCargoMutation, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: updateWHCargo,
      onSuccess: () => {
        disclosure.onClose();
      },
    });
  const onChangeBIN = (str: string) => {
    setValue("client_bin.xin", str);
  };
  useEffect(() => {
    if (!row) return;
    prefillWHCargo(setValue, row);
  }, [row, setValue]);
  return (
    <Modal
      isOpen={disclosure.isOpen}
      isDismissable={!(isPendingUpdate || isPending)}
      onOpenChange={disclosure.onOpenChange}
      size="2xl"
    >
      <ModalContent>
        <form
          onSubmit={handleSubmit((data) => {
            const dto = {
              ...data,
              trip_id,
            };
            mode == "Create" ? mutate(dto) : updateWHCargoMutation(data);
          })}
        >
          <ModalHeader>
            {mode == "Create" ? "Создание груза" : "Обновите данные груза"}
          </ModalHeader>
          <Divider />
          <ModalBody>
            <div className="grid grid-cols-2 gap-2 w-full ">
              <Textarea
                {...register("receipt_address")}
                label="Адрес получения груза"
                className=" "
                minRows={4}
              />
              <div className="flex flex-col gap-2">
                <Input
                  {...register("client_bin.tempText")}
                  label={`Клиент\n\n(получатель груза)`}
                />
                <BINInput onChange={onChangeBIN} />
              </div>
              <div className="grid grid-cols-2 col-span-2 space-y-2">
                <div className="grid grid-cols-2 col-span-2 gap-2 items-center">
                  <Controller
                    control={control}
                    name="unloading_point.city"
                    render={({ field }) => (
                      <Cities
                        selectedKey={field.value}
                        label="В город"
                        onSelectionChange={(e) => {
                          setValue("unloading_point.city", e?.toString());
                        }}
                      />
                    )}
                  />

                  <Input
                    className="col-span-2"
                    {...register("unloading_point.deliveryAddress")}
                    label={`Адрес доставки`}
                    placeholder="Если адреса нет - просто оставьте поле пустым"
                  />
                </div>
              </div>

              <DriversWithCars
                aria-label="Driver Cities"
                selectedKey={driver?.id}
                label="Выберите водителя"
                onSelectionChange={(e) => {
                  setValue("driver.id", e ? e.toString() : "");
                }}
              />

              {driver?.id === "24" && (
                <Input
                  aria-label="Driver Textarea"
                  label="Сумма оплаты наемнику"
                  value={driver?.value}
                  onChange={(e) => {
                    setValue("driver.value", e.target.value);
                  }}
                />
              )}

              <div className="flex gap-2">
                <Input {...register("weight")} label="Вес (тонн)" />
                <Input {...register("volume")} label="Объем" />
              </div>

              <Controller
                control={control}
                name="quantity"
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Input label="Количество" {...register("quantity.value")} />
                    <Input
                      label="Коробки / палеты"
                      {...register("quantity.type")}
                    />
                  </div>
                )}
              />

              <Input {...register("cargo_name")} label="Название груза" />

              <Controller
                control={control}
                name="is_documents"
                render={({ field }) => (
                  // @ts-ignore
                  <Checkbox {...field} type="checkbox">
                    Наличие документов
                  </Checkbox>
                )}
              />
              <Controller
                control={control}
                name="is_unpalletizing"
                render={({ field }) => (
                  // @ts-ignore
                  <Checkbox {...field} type="checkbox">
                    Распалетирование
                  </Checkbox>
                )}
              />

              <div className="col-span-2">
                <Textarea
                  {...register("comments")}
                  label="Комментарии"
                  className="full"
                />
              </div>

              <UDatePicker
                control={control}
                name="status"
                label="Дата поступления на склад"
                hideTimeZone
                granularity="day"
              />
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter className="flex gap-2">
            <Button
              variant="light"
              color="danger"
              type="reset"
              isLoading={isPendingUpdate || isPending}
            >
              Отмена
            </Button>
            <Button
              color="success"
              variant="flat"
              type="submit"
              isLoading={isPendingUpdate || isPending}
            >
              {mode == "Create" ? " Создать груз" : "Обновить груз"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
