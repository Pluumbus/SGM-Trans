"use client";

import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Button,
  Input,
  Checkbox,
  Textarea,
  DatePicker,
  Tooltip,
} from "@nextui-org/react";
import { TM } from "@/app/(backend-logic)/workflow/_feature/TransportationManagerActions";
import { BINInput } from "@/app/(backend-logic)/workflow/_feature/BINInput";
import { Cities, DriversWithCars } from "@/lib/references";
import { useUpdateCargoContext } from "./Context";
import { parseDate } from "@internationalized/date";
import { formatDate } from "@/lib/helpers";
import { UDatePicker } from "@/tool-kit/U";
import { useMutation } from "@tanstack/react-query";
import { useUpdateCargo } from "./requests";
import { useFieldFocus } from "../Contexts";
import { FormNumberInput } from "@/components";
import { SNTModal } from "./SNTModal";

export const UpdateModal = () => {
  const { disclosure, row, sntDisclosure } = useUpdateCargoContext();

  const [fieldToFocusOn] = useFieldFocus();

  const { register, handleSubmit, setValue, control, watch } =
    useForm<CargoType>({
      defaultValues: {
        id: 0,
        trip_id: 0,
        created_at: "",
        receipt_address: "",
        unloading_point: {
          city: "",
          withDelivery: false,
          deliveryAddress: "",
        },
        weight: "",
        volume: "",
        quantity: {
          value: "",
          type: "",
        },
        driver: {
          id: "",
          value: "",
        },
        amount: {
          value: "",
          type: "",
        },
        is_unpalletizing: false,
        comments: "",
        client_bin: {
          tempText: "",
          snts: [],
          xin: "",
        },
        cargo_name: "",
        transportation_manager: 0,
        is_documents: false,
        status: null,
        loading_scheme: "",
        user_id: "",
        act_details: {
          is_ready: false,
          user_id: "",
          amount: 0,
          date_of_act_printed: "",
        },
        paid_amount: 0,
        request_id: null,
        is_deleted: false,
        wh_id: null,
      },
    });

  useEffect(() => {
    if (!row) return;

    // Top-level fields
    setValue("id", row.id);
    setValue("trip_id", row.trip_id);
    setValue("created_at", row.created_at || "");
    setValue("receipt_address", row.receipt_address || "");
    setValue("weight", row.weight || "");
    setValue("volume", row.volume || "");
    setValue("is_unpalletizing", row.is_unpalletizing || false);
    setValue("comments", row.comments || "");
    setValue("cargo_name", row.cargo_name || "");
    setValue("transportation_manager", row.transportation_manager || 0);
    setValue("is_documents", row.is_documents || false);

    setValue("loading_scheme", row.loading_scheme || "");
    setValue("user_id", row.user_id || "");
    setValue("paid_amount", row.paid_amount || 0);
    setValue("request_id", row.request_id);
    setValue("is_deleted", row.is_deleted || false);
    setValue("wh_id", row.wh_id);
    setValue("status", row.status ? new Date(row.status).toISOString() : null);

    // Nested: unloading_point
    setValue("unloading_point.city", row.unloading_point.city || "");
    setValue(
      "unloading_point.withDelivery",
      row.unloading_point.withDelivery || false
    );
    setValue(
      "unloading_point.deliveryAddress",
      row.unloading_point.deliveryAddress || ""
    );

    // Nested: quantity
    setValue("quantity.value", row.quantity.value || "");
    setValue("quantity.type", row.quantity.type || "");

    // Nested: driver
    setValue("driver.id", row.driver.id || "");
    setValue("driver.value", row.driver.value || "");

    // Nested: amount
    setValue("amount.value", row.amount.value || "");
    setValue("amount.type", row.amount.type || null);

    // Nested: client_bin
    setValue("client_bin.tempText", row.client_bin.tempText || "");
    setValue("client_bin.xin", row.client_bin.xin || "");
    setValue("client_bin.snts", row.client_bin.snts || []);

    // Nested: act_details
    setValue("act_details.is_ready", row.act_details.is_ready || false);
    setValue("act_details.user_id", row.act_details.user_id || "");
    setValue("act_details.amount", row.act_details.amount || 0);
    setValue(
      "act_details.date_of_act_printed",
      row.act_details.date_of_act_printed || ""
    );
  }, [row, setValue]);

  const [withDelivery, driver] = watch([
    "unloading_point.withDelivery",
    "driver",
  ]);

  const { mutate, isPending } = useUpdateCargo();

  const onSubmit: SubmitHandler<CargoType> = (data) => {
    mutate(data);
  };
  const state = useState<number>(row?.transportation_manager);

  const onChange = () => {
    setValue("transportation_manager", state[0]);
  };

  const onChangeBIN = (str: string) => {
    setValue("client_bin.xin", str);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "client_bin.snts",
  });

  return (
    <>
      <Modal
        isOpen={disclosure.isOpen}
        onOpenChange={disclosure.onOpenChange}
        classNames={{
          wrapper: "min-w-[95vw] !rounded-none rounded-large shadow-small ",
          base: "min-w-[95vw] rounded-large shadow-small ",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>Изменить груз</ModalHeader>
            <Divider />

            <ModalBody>
              <div className="grid grid-cols-5 gap-4">
                {/* receipt_address */}
                <Textarea
                  {...register("receipt_address")}
                  label="Адрес получения груза"
                  variant="bordered"
                  minRows={4}
                  autoFocus={fieldToFocusOn === "receipt_address"}
                />

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center w-full">
                    <Controller
                      control={control}
                      name="unloading_point.city"
                      render={({ field }) => (
                        <Cities
                          selectedKey={field.value}
                          variant="underlined"
                          label="В город"
                          className="w-full"
                          onSelectionChange={(e) => {
                            setValue("unloading_point.city", e?.toString());
                          }}
                          /** Focus if this is the fieldToFocusOn */
                          autoFocus={fieldToFocusOn === "unloading_point"}
                        />
                      )}
                    />
                  </div>

                  {withDelivery && (
                    <div>
                      <Input
                        variant="underlined"
                        {...register("unloading_point.deliveryAddress")}
                        label="Адрес доставки"
                      />
                    </div>
                  )}
                </div>

                {/* weight + volume */}
                <div className="flex flex-col gap-2">
                  <Input
                    variant="underlined"
                    label="Вес (тонн)"
                    type="text"
                    {...register("weight")}
                    autoFocus={fieldToFocusOn === "weight"}
                  />

                  <Input
                    variant="underlined"
                    label="Объём (м³)"
                    type="text"
                    {...register("volume")}
                    autoFocus={fieldToFocusOn === "volume"}
                  />
                </div>

                {/* quantity.value + quantity.type */}
                <div className="flex flex-col gap-2">
                  <Input
                    variant="underlined"
                    label="Количество (значение)"
                    type="text"
                    {...register("quantity.value")}
                    autoFocus={fieldToFocusOn === "quantity"}
                  />
                  <Input
                    label="Тип груза (коробки/палеты)"
                    variant="underlined"
                    type="text"
                    {...register("quantity.type")}
                  />
                </div>

                {/* client_bin.tempText + client_bin.xin */}
                <div className="flex flex-col gap-2">
                  <Input
                    {...register("client_bin.tempText")}
                    variant="underlined"
                    label="Клиент (получатель груза)"
                    autoFocus={fieldToFocusOn === "client_bin"}
                  />
                  <div className="flex gap-2 items-end">
                    <BINInput
                      {...register("client_bin.xin")}
                      inputProps={{
                        variant: "underlined",
                      }}
                      onChange={onChangeBIN}
                    />
                    <div>
                      <Button
                        variant="flat"
                        onPress={() => {
                          sntDisclosure.onOpen();
                        }}
                      >
                        SNT
                      </Button>
                    </div>
                  </div>
                </div>

                {/* comments */}
                <div>
                  <Textarea
                    label="Комментарии"
                    variant="bordered"
                    minRows={9}
                    {...register("comments")}
                    autoFocus={fieldToFocusOn === "comments"}
                  />
                </div>

                {/* driver + status */}
                <div className="flex flex-col gap-2">
                  <DriversWithCars
                    variant="underlined"
                    aria-label="Driver Cities"
                    selectedKey={driver.id}
                    label="Выберите водителя"
                    onSelectionChange={(e) => {
                      setValue("driver.id", e ? e.toString() : "");
                    }}
                    /** If you want it to autofocus */
                    autoFocus={fieldToFocusOn === "driver"}
                  />

                  {driver?.id === "24" && (
                    <Input
                      variant="underlined"
                      aria-label="Driver Textarea"
                      label="Сумма оплаты наемнику"
                      value={driver?.value}
                      onChange={(e) => {
                        setValue("driver.value", e.target.value);
                      }}
                    />
                  )}

                  <UDatePicker
                    control={control}
                    name="status"
                    label="Дата поступления на склад"
                    variant="bordered"
                    hideTimeZone
                    granularity="day"
                    /** If the component supports autoFocus */
                    autoFocus={fieldToFocusOn === "status"}
                  />
                </div>

                {/* amount + checkboxes */}
                <div className="flex flex-col gap-2">
                  <FormNumberInput
                    name={"amount.value"}
                    setValue={setValue}
                    inputProps={{
                      label: "Cумма",
                      autoFocus: fieldToFocusOn === "amount",
                      variant: "underlined",
                    }}
                  />

                  <Input
                    label="Тип оплаты"
                    type="text"
                    variant="underlined"
                    {...register("amount.type")}
                  />

                  <div className="flex items-center gap-2">
                    <Checkbox
                      {...register("is_documents")}
                      autoFocus={fieldToFocusOn === "is_documents"}
                    >
                      Наличие документов
                    </Checkbox>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      {...register("is_unpalletizing")}
                      autoFocus={fieldToFocusOn === "is_unpalletizing"}
                    >
                      Распалетирование
                    </Checkbox>
                  </div>
                </div>

                <TM
                  state={state}
                  onChange={onChange}
                  autocompleteProps={{
                    variant: "underlined",
                    isDisabled: true,
                  }}
                  type="Update Cargo Modal"
                />
              </div>

              {/* user_id */}
              {/* <div className="flex gap-2">
                <span>Создатель груза / SGM менеджер</span>
                <Input label="User ID" type="text" {...register("user_id")} />
              </div> */}
            </ModalBody>

            <Divider />

            <ModalFooter>
              <Button
                color="danger"
                onPress={() => {
                  disclosure.onClose();
                }}
                variant="light"
                isLoading={isPending}
              >
                Отмена
              </Button>
              <Button
                color="success"
                type="submit"
                variant="flat"
                isLoading={isPending}
              >
                Сохранить
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      <SNTModal
        fields={fields}
        append={append}
        remove={remove}
        register={register}
      />
    </>
  );
};
