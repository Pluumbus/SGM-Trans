import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode, useState } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { DatePicker, DateValue, Divider } from "@nextui-org/react";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { formatDate } from "../Date";

type Type = CargoType["status"];

export const Status = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  const [estDate, setEstDate] = useState<DateValue>(
    parseDate(
      formatDate(new Date(values.estimatedDate.toString()).toISOString())
    ) || today(getLocalTimeZone())
  );
  const [factDate, setFactDate] = useState<DateValue>(
    values?.factDate
      ? parseDate(
          formatDate(new Date(values?.factDate?.toString())?.toISOString())
        )
      : today(getLocalTimeZone()).add({ days: 7 })
  );

  return (
    <div className="grid grid-cols-2 justify-between gap-2 w-[20rem] ">
      <span>Предпологаемая дата доставки</span>
      <DatePicker
        variant="bordered"
        aria-label="Estemated date"
        value={estDate}
        onChange={(e) => {
          setEstDate(e);
          setValues((prev) => ({
            ...prev,
            estimatedDate: `${e.year}-${e.month}-${e.day}`,
          }));
        }}
      />
      <Divider className="col-span-2" />
      <span>Фактическая дата доставки</span>
      <DatePicker
        aria-label="Fact date"
        variant="bordered"
        value={factDate}
        onChange={(e) => {
          setFactDate(e);
          setValues((prev) => ({
            ...prev,
            factDate: `${e.year}-${e.month}-${e.day}`,
          }));
        }}
      />
    </div>
  );
};
