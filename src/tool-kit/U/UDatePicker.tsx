"use client";

import React, { useId } from "react";
import { DatePicker, DatePickerProps } from "@nextui-org/react";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import {
  parseAbsoluteToLocal,
  DateValue,
  getLocalTimeZone,
  now,
} from "@internationalized/date";

interface UDatePickerProps<TFieldValues extends FieldValues>
  extends Omit<DatePickerProps, "value" | "onChange" | "defaultValue"> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
}

export function UDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  defaultValue,
  ...rest
}: UDatePickerProps<TFieldValues>) {
  const id = useId();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={
        (defaultValue as PathValue<TFieldValues, Path<TFieldValues>>) || null
        // (now(getLocalTimeZone())
        //   // @ts-ignore тут просто сам JS тупит, он говорит ожидает 1 тему, а получил 0, хотя у него в интрефейсе прописано что он ниче не ждет
        //   .toDate(getLocalTimeZone())
        //   .toISOString() as PathValue<TFieldValues, Path<TFieldValues>>)
      }
      render={({ field }) => {
        const { onChange, value } = field;
        const dateValue: DateValue | null =
          typeof value === "string" ? parseAbsoluteToLocal(value) : null;

        return (
          <DatePicker
            {...rest}
            aria-label={`UDatePicker-${id}`}
            value={dateValue}
            onChange={(newVal) => {
              if (!newVal) {
                onChange(null);
                return;
              }
              const isoString = newVal.toDate(getLocalTimeZone()).toISOString();

              onChange(isoString);
            }}
          />
        );
      }}
    />
  );
}
