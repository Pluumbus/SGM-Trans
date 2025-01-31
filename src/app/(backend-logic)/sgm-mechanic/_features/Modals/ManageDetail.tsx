import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDisclosureContext } from "../DisclosureContext";
import { Controller, useForm } from "react-hook-form";
import { FormNumberInput } from "@/components";
import { DatePicker } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { updateDetailToCar } from "../../_api/supa.requests";
import {
  AccumulatorType,
  SingleDetailType,
} from "@/lib/references/drivers/feature/types";
import { parseDate } from "@internationalized/date";
import { formatDate } from "@/lib/helpers";

export const ManageDetail = () => {
  const { isOpen, onOpenChange, data, onClose } = useDisclosureContext();

  const { handleSubmit, register, setValue, reset, getValues, control } =
    useForm<SingleDetailType & { inputMileage: string }>();

  const { mutate } = useMutation({
    mutationFn: updateDetailToCar,
    onSuccess: () => {
      onOpenChange();
    },
    onError: (error) => {
      console.error("Error updating detail:", error);
    },
  });

  useEffect(() => {
    if (data?.detail) {
      setValue("installation_date", data.detail?.installation_date);
      setValue("mileage", data.detail?.mileage);
      if (data?.detail?.model) {
        setValue("model", data.detail?.model);
      }
    }
  }, [data, setValue]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [isOpen]);

  const onSubmit = (formData: SingleDetailType & { inputMileage: string }) => {
    if (!data) return;

    const getNextMileage = () => {
      if (getValues().inputMileage) {
        return Number(
          data.car.omnicommData[0].ccan?.spn245
            ? Number(getValues().inputMileage) +
                Number(
                  parseFloat(
                    data.car.omnicommData[0].ccan?.spn245.toString()
                  ).toFixed(2)
                )
            : 0
        );
      } else {
        return data.car.omnicommData[0].ccan?.spn245
          ? parseFloat(
              data.car.omnicommData[0].ccan?.spn245.toString()
            ).toFixed(2)
          : 0;
      }
    };

    const dataWOInputField = formData;
    delete dataWOInputField.inputMileage;

    const updatedDetail = {
      ...data.detail,
      ...dataWOInputField,
      mileage: {
        next_mileage: getNextMileage(),
        last_mileage: data.car.omnicommData[0].ccan?.spn245
          ? parseFloat(
              data.car.omnicommData[0].ccan?.spn245.toString()
            ).toFixed(2)
          : 0,
        // last_mileage: data.car.details?.temp_can_mileage
        //   ? parseFloat(data.car.details?.temp_can_mileage.toString()).toFixed(2)
        //   : 0,
      },
      installation_date:
        typeof formData.installation_date == "string" &&
        formData.installation_date !== ""
          ? `${formData.installation_date}`
          : formData.installation_date?.year
            ? // @ts-ignore
              `${formData.installation_date.year}-${formData.installation_date.month}-${formData.installation_date.day}`
            : `${new Date().toISOString().split("T")[0]}`,
    };

    mutate({
      car: data.car,
      updatedDetail,
      section: data.type,
    });
  };

  const renderModalHeader = () => {
    if (!data) return null;

    switch (data.type) {
      case "wheel":
        return <span>Колесо</span>;
      case "brake_shoe":
        return <span>Колодка</span>;
      case "accumulator":
        return (
          <span>
            Аккумулятор:&nbsp;
            <span className="font-semibold">{data.detail?.location}</span>
          </span>
        );
      case "detail":
        return <span>{data.detail?.name}</span>;
      default:
        return <p>Нет доступной информации</p>;
    }
  };

  const renderModalContent = () => {
    if (!data) return null;

    switch (data.type) {
      case "detail":
        return (
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="installation_date"
              render={({ field }) => (
                <DatePicker
                  value={parseDate(
                    formatDate(
                      field.value
                        ? new Date(field.value?.toString())?.toISOString()
                        : new Date().toISOString()
                    )
                  )}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  label="Дата установки"
                />
              )}
            />
            <FormNumberInput
              name="inputMileage"
              setValue={setValue}
              inputProps={{
                label: "Через сколько км замена",
              }}
            />
          </div>
        );
      case "accumulator":
        return (
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="installation_date"
              render={({ field }) => (
                <DatePicker
                  value={parseDate(
                    formatDate(
                      field.value
                        ? new Date(field.value?.toString())?.toISOString()
                        : new Date().toISOString()
                    )
                  )}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  label="Дата установки"
                />
              )}
            />
            <Input
              {...register("model")}
              label="Модель аккумулятора"
              defaultValue={(data.detail as AccumulatorType)?.model}
            />
          </div>
        );
      case "wheel":
        return (
          <div className="flex flex-col gap-2">
            <FormNumberInput
              name="inputMileage"
              setValue={setValue}
              inputProps={{
                label: "Через сколько км замена",
              }}
            />
          </div>
        );
      case "brake_shoe":
        return (
          <div className="flex flex-col gap-2">
            <Input label="Модель колодки" {...register("model")} />
            <FormNumberInput
              name="inputMileage"
              setValue={setValue}
              inputProps={{
                label: "Через сколько км замена",
              }}
            />
          </div>
        );
      default:
        return <p>Нет доступной информации</p>;
    }
  };

  return (
    <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <div className="flex gap-2 items-center font-normal">
              <span>Изменить деталь:</span>
              <span className="font-semibold">{renderModalHeader()}</span>
            </div>
          </ModalHeader>
          <Divider />
          <ModalBody>{renderModalContent()}</ModalBody>
          <Divider />
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Закрыть
            </Button>
            <Button color="success" type="submit">
              Сохранить
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
