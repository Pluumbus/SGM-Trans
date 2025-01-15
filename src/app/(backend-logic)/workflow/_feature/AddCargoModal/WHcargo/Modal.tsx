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
import { Cities } from "@/lib/references";
import { useMutation } from "@tanstack/react-query";
import { addWHCargo } from "./api";
import { useToast } from "@/components/ui/use-toast";
import { BINInput } from "../../BINInput/BINInput";
import { UDatePicker } from "@/tool-kit/U";

export const WHAddCargoModal = ({
  disclosure,
  trip_id,
}: {
  disclosure: ReturnType<typeof useDisclosure>;
  trip_id: number;
}) => {
  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<WHCargoType>();

  const [withDelivery] = watch(["unloading_point.withDelivery"]);
  const { toast } = useToast();
  const { mutate } = useMutation({
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
  const onChangeBIN = (str: string) => {
    setValue("client_bin.xin", str);
  };
  return (
    <Modal
      isOpen={disclosure.isOpen}
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
            mutate(dto);
          })}
        >
          <ModalHeader>Создание груза</ModalHeader>
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
                {withDelivery ? (
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

                    <Controller
                      control={control}
                      name="unloading_point.withDelivery"
                      render={({ field }) => (
                        // @ts-ignore
                        <Checkbox {...field} isSelected={withDelivery}>
                          С&nbsp;доставкой
                        </Checkbox>
                      )}
                    />
                  </div>
                ) : (
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <Controller
                      control={control}
                      name="unloading_point.city"
                      render={({ field }) => (
                        <Cities
                          selectedKey={field?.value}
                          label="В город"
                          onSelectionChange={(e) => {
                            setValue("unloading_point.city", e?.toString());
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="unloading_point.withDelivery"
                      render={({ field }) => (
                        // @ts-ignore
                        <Checkbox {...field} isSelected={withDelivery}>
                          С&nbsp;доставкой
                        </Checkbox>
                      )}
                    />
                  </div>
                )}

                {withDelivery && (
                  <Input
                    className="col-span-2"
                    {...register("unloading_point.deliveryAddress")}
                    label={`Адрес доставки`}
                  />
                )}
              </div>

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
                granularity="day"
              />
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter className="flex gap-2">
            <Button variant="light" color="danger" type="reset">
              Отмена
            </Button>
            <Button color="success" variant="flat" type="submit">
              Создать груз
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
