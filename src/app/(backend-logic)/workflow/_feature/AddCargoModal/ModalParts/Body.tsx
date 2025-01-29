import { Cities, PRICE_TYPE } from "@/lib/references";

import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  DatePicker,
  Input,
  ModalBody,
  Textarea,
} from "@nextui-org/react";
import React, { useState } from "react";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { CargoType } from "../../types";
import { TM } from "../../TransportationManagerActions";

import { FormNumberInput } from "@/components";
import { BINInput } from "../../BINInput";
import { UDatePicker } from "@/tool-kit/U/UDatePicker";

type Props = {
  props: {
    register: UseFormRegister<CargoType>;
    watch: UseFormWatch<CargoType>;
    setValue: UseFormSetValue<CargoType>;
    control: Control<CargoType, any>;
  };
};
export const Body = ({
  props: { register, watch, control, setValue },
}: Props) => {
  const [withDelivery, amountType, is_documents, xin] = watch([
    "unloading_point.withDelivery",
    "amount.type",
    "is_documents",
    "client_bin.xin",
  ]);
  const state = useState<number>(null);

  const onChange = () => {
    setValue("transportation_manager", state[0]);
  };

  const onChangeBIN = (str: string) => {
    setValue("client_bin.xin", str);
  };
  return (
    <ModalBody className="transition-all">
      <div className="grid grid-cols-2 gap-2 w-full ">
        <div className="col-span-2 flex gap-2 h-full">
          <Textarea
            {...register("receipt_address")}
            label="Адрес получения груза"
            className="!min-h-full w-1/2"
            minRows={4}
          />

          <div className="flex flex-col gap-2 w-1/2">
            <Input
              {...register("client_bin.tempText")}
              label={`Клиент\n\n(получатель груза)`}
            />
            <BINInput
              {...register("client_bin.xin")}
              initValue={xin}
              onChange={onChangeBIN}
            />
          </div>
        </div>

        <TM state={state} onChange={onChange} />

        <div className="grid grid-cols-2 col-span-2 space-y-2">
          {withDelivery ? (
            <div className="flex items-start col-span-2">
              <div className="flex gap-2 items-center">
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
            </div>
          ) : (
            <div className="col-span-2">
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
            <div className="flex gap-2 ">
              <Input label="Количество" {...register("quantity.value")} />
              <Input label="Коробки / палеты" {...register("quantity.type")} />
            </div>
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <div className="flex gap-2 ">
              <FormNumberInput
                // @ts-ignore
                name={"amount.value"}
                setValue={setValue}
                inputProps={{
                  label: "Сумма оплаты (тг.)",
                }}
              />

              <Autocomplete
                label="Способ оплаты"
                selectedKey={amountType}
                onSelectionChange={(e) => {
                  // @ts-ignore
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
            // @ts-ignore
            <Checkbox {...field} type="checkbox">
              Распалечиваем
            </Checkbox>
          )}
        />

        <Checkbox
          type="checkbox"
          isSelected={is_documents}
          onValueChange={(e) => {
            setValue("is_documents", e);
          }}
        >
          Наличие документов
        </Checkbox>

        <div className="col-span-2">
          <Textarea
            {...register("comments")}
            label="Комментарии"
            className="full"
          />
        </div>

        {/* <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <DatePicker
              // @ts-ignore
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
              }}
              label="Дата поступления на склад"
            />
          )}
        /> */}
        <UDatePicker
          {...register("status")}
          control={control}
          name="status"
          label="Дата поступления на склад"
          hideTimeZone
          granularity="day"
        />

        <Input {...register("loading_scheme")} label="Схема погрузки" />
      </div>
    </ModalBody>
  );
};
