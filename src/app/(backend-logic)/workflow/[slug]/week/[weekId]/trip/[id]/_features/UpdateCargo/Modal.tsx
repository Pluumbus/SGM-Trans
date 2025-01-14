"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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

export const UpdateModal = () => {
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

  const [withDelivery, driver] = watch([
    "unloading_point.withDelivery",
    "driver",
  ]);
  const onSubmit: SubmitHandler<CargoType> = (data) => {
    console.log("Form Submitted:", data);
    // Handle update API call or other logic
  };
  const state = useState<number>(null);

  const onChange = () => {
    setValue("transportation_manager", state[0]);
  };

  const onChangeBIN = (str: string) => {
    setValue("client_bin.xin", str);
  };

  return (
    <Modal
      isOpen
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
                      />
                    )}
                  />
                </div>

                {withDelivery && (
                  <div>
                    <Input
                      variant="underlined"
                      {...register("unloading_point.deliveryAddress")}
                      label={`Адрес доставки`}
                      //   placeholder="если нет, оставьте пустым"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {/* weight */}
                <Input
                  variant="underlined"
                  label="Вес (тонн)"
                  type="text"
                  {...register("weight")}
                />

                {/* volume */}
                <Input
                  variant="underlined"
                  label="Объём (м³)"
                  type="text"
                  {...register("volume")}
                />
              </div>

              <div className="flex flex-col gap-2">
                {/* quantity.value */}
                <Input
                  variant="underlined"
                  label="Количество (значение)"
                  type="text"
                  {...register("quantity.value")}
                />
                {/* quantity.type */}
                <Input
                  label="Тип груза (коробки/палеты)"
                  variant="underlined"
                  type="text"
                  {...register("quantity.type")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  {...register("client_bin.tempText")}
                  variant="underlined"
                  label={`Клиент\n\n(получатель груза)`}
                />
                <BINInput
                  {...register("client_bin.xin")}
                  inputProps={{
                    variant: "underlined",
                  }}
                  onChange={onChangeBIN}
                />
              </div>

              {/* comments */}
              <div>
                <Textarea
                  label="Комментарии"
                  variant="bordered"
                  minRows={9}
                  {...register("comments")}
                />
              </div>
              <div className="flex flex-col gap-2">
                {/* driver */}

                <DriversWithCars
                  variant="underlined"
                  aria-label="Driver Cities"
                  selectedKey={driver.id}
                  label="Выберите водителя"
                  onSelectionChange={(e) => {
                    setValue("driver.id", e ? e.toString() : "");
                  }}
                />

                {driver?.id == "24" && (
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

                {/* status */}
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <DatePicker
                      // @ts-ignore
                      value={field.value}
                      variant="bordered"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      label="Дата поступления на склад"
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-2">
                {/* amount.value */}
                <Input
                  label="Cумма"
                  type="text"
                  variant="underlined"
                  {...register("amount.value")}
                />

                {/* amount.type */}
                <Input
                  label="Тип оплаты"
                  type="text"
                  variant="underlined"
                  {...register("amount.type")}
                />
                {/* is_documents */}
                <div className="flex items-center gap-2">
                  <Checkbox {...register("is_documents")}>
                    Наличие документов
                  </Checkbox>
                </div>
                {/* is_unpalletizing */}
                <div className="flex items-center gap-2">
                  <Checkbox {...register("is_unpalletizing")}>
                    Распалетирование
                  </Checkbox>
                </div>
              </div>

              <TM
                state={state}
                onChange={onChange}
                autocompleteProps={{
                  variant: "underlined",
                }}
                type="Update Cargo Modal"
              />

              <div className="flex flex-col gap-2">
                {/* loading_scheme */}
                {/* <Input
                  label="Схема загрузки"
                  variant="underlined"
                  type="text"
                  {...register("loading_scheme")}
                /> */}
              </div>

              {/* 
                request_id & wh_id сделать ссылки на то из чего был создан груз
                <Input
                label="ID Заявки"
                type="number"
                {...register("request_id", { valueAsNumber: true })}
                />

                
                <Input
                label="ID склада"
                type="number"
                {...register("wh_id", { valueAsNumber: true })}
                /> 
            */}
            </div>

            {/* user_id */}
            {/* <div className="flex gap-2">
                <span>Создатель груза / SGM менеджер</span>
                <Input label="User ID" type="text" {...register("user_id")} />
              </div> */}
          </ModalBody>

          <Divider />

          <ModalFooter>
            <Button color="primary" type="submit">
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
