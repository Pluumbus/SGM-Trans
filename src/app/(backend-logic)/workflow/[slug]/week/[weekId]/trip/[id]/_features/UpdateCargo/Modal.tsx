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
  Tabs,
  Tab,
} from "@nextui-org/react";
import { TM } from "@/app/(backend-logic)/workflow/_feature/TransportationManagerActions";
import { BINInput } from "@/app/(backend-logic)/workflow/_feature/BINInput";
import { Cities, DriversWithCars } from "@/lib/references";
import { useUpdateCargoContext } from "./Context";
import { UDatePicker } from "@/tool-kit/U";
import { useUpdateCargo } from "./requests";
import { useFieldFocus } from "../Contexts";
import { FormNumberInput } from "@/components";
import { SNTModal } from "./SNTModal";
import { prefillForm } from "./helpers";
import { Audit } from "./Audit";

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

  const [xin, driver] = watch(["client_bin.xin", "driver"]);

  const { mutate, isPending } = useUpdateCargo();

  const onSubmit: SubmitHandler<CargoType> = (data) => {
    mutate(data);
  };
  const state = useState<number>(null);

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

  useEffect(() => {
    if (!row) return;
    prefillForm(setValue, row);
    state[1](row?.transportation_manager);
  }, [row, setValue]);

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
            <Tabs>
              <Tab key={"Update cargo"} title="Обновить данные груза">
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

                      <div>
                        <Input
                          variant="underlined"
                          {...register("unloading_point.deliveryAddress")}
                          label="Адрес доставки"
                        />
                      </div>
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
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          variant="underlined"
                          label="Количество (значение)"
                          type="text"
                          {...register("quantity.value")}
                          autoFocus={fieldToFocusOn === "quantity"}
                        />
                        <Input
                          variant="underlined"
                          label="Наименование груза"
                          type="text"
                          {...register("cargo_name")}
                          autoFocus={fieldToFocusOn === "cargo_name"}
                        />
                      </div>
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
                          inputProps={{
                            variant: "underlined",
                          }}
                          initValue={xin}
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
                      <FormNumberInput<CargoType>
                        name={"amount.value"}
                        setValue={setValue}
                        initValue={Number(row?.amount?.value)}
                        inputProps={{
                          label: "Сумма",
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
              </Tab>
              <Tab key={"Audit"} title="Журнал">
                <ModalHeader>Журнал</ModalHeader>
                <Divider />
                <ModalBody>
                  <Audit />
                </ModalBody>
                <Divider />
                <ModalFooter></ModalFooter>
              </Tab>
            </Tabs>
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
