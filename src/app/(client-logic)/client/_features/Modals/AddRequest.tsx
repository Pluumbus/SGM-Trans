import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
  Checkbox,
  Textarea,
} from "@nextui-org/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ClientRequestType } from "../../types";
import { addClientRequest } from "../api";
import { useToast } from "@/components/ui/use-toast";
import { Cities } from "@/lib/references";
import { clientRequestSchema } from "./addRequest.schema";

export type AddRequestProps = {
  disclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
};

export const AddRequest = ({ disclosure }: AddRequestProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<ClientRequestType>();
  const { toast } = useToast();

  const [withDelivery] = watch(["unloading_point.withDelivery"]);

  const { mutate, isPending } = useMutation({
    mutationFn: addClientRequest,
    onSuccess: () => {
      toast({
        title: "Вы успешно добавили заявку",
        description: "В течении двух рабочих дней с вами свяжется наш логист",
        duration: 3000,
      });
      reset();
      disclosure.onOpenChange();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Обратитесь в поддержку: ${error}`,
        duration: 3000,
      });
    },
  });

  const onSubmit: SubmitHandler<ClientRequestType> = (data) => {
    const parsedData = clientRequestSchema.safeParse(data);

    if (!parsedData.success) {
      const errorMessages = parsedData.error.errors
        .map((err) => err.message)
        .slice(1);
      toast({
        title: "Ошибка",
        description: (
          <div className="flex flex-col">
            <span>Пожалуйста, проверьте данные:</span>
            {errorMessages.map((e, i) => (
              <span key={i}>
                #{i + 1}: {e}
              </span>
            ))}
          </div>
        ),
        duration: 10000,
      });
      return;
    }
    console.log("data.unloading_point", data.unloading_point);

    const unlPoint = data.unloading_point?.city
      ? {
          city: data.unloading_point.city,
          withDelivery: data.unloading_point.withDelivery || false,
          deliveryAddress: data.unloading_point.withDelivery || "",
        }
      : {
          city: "",
          withDelivery: false,
          deliveryAddress: "",
        };

    // @ts-ignore
    mutate({
      ...parsedData.data,
      quantity: {
        value: parsedData.data.quantity.value,
        type: "",
      },
      client_bin: {
        snts: ["KZ-SNT-"],
        tempText: parsedData.data.client_bin.tempText || "",
        xin: "",
      },
      unloading_point: unlPoint,
    });
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="3xl"
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            Добавить заявку
          </ModalHeader>
          <Divider />
          <ModalBody className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <div className="w-full flex gap-2">
                <Input
                  label="Вес (тонны)"
                  {...register("weight")}
                  errorMessage={errors.weight?.message}
                />
                <Input
                  label="Колличество (шт.)"
                  {...register("quantity.value")}
                  errorMessage={errors.quantity?.value?.message}
                />
                <Input
                  label="Объем (куб. м)"
                  {...register("volume")}
                  errorMessage={errors.volume?.message}
                />
              </div>
            </div>
            <div className="col-span-2 grid gap-2 grid-cols-3">
              <Controller
                control={control}
                name="departure"
                render={({ field }) => (
                  <Cities
                    selectedKey={field.value}
                    label="Город забора груза"
                    onSelectionChange={(e) => {
                      setValue("departure", e?.toString() || "");
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="unloading_point.city"
                render={({ field }) => (
                  <Cities
                    selectedKey={field.value}
                    label="Город выгрузки"
                    onSelectionChange={(e) => {
                      setValue("unloading_point.city", e?.toString() || "");
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

            {withDelivery && (
              <Input
                {...register("unloading_point.deliveryAddress")}
                label={`Адрес доставки`}
                className="col-span-2"
              />
            )}

            <Input
              label="Название компании"
              {...register("client_bin.tempText")}
            />

            <Input
              label="БИН компании/ИИН если ИП"
              {...register("client_bin.xin")}
            />
            <Textarea label="Наименование груза" {...register("cargo_name")} />
            <Textarea
              label="Комментарии для логиста"
              {...register("comments")}
            />
            <Input
              label="Телефон для обратной связи"
              {...register("phone_number")}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={disclosure.onOpenChange}
            >
              Закрыть
            </Button>
            <Button color="success" type="submit">
              Добавить
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
