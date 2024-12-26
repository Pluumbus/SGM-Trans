import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode, useState } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { DatePicker, DateValue } from "@nextui-org/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { formatDate } from "@/lib/helpers";

type Type = CargoType["status"];

export const Status = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  const [estDate, setEstDate] = useState<DateValue>(
    values
      ? parseDate(formatDate(new Date(values?.toString())?.toISOString()))
      : today(getLocalTimeZone()).add({ days: 7 }),
  );

  return (
    <DatePicker
      variant="bordered"
      aria-label="Estemated date"
      value={estDate}
      onChange={(e) => {
        setEstDate(e);
        setValues(() => `${e.year}-${e.month}-${e.day}`);
      }}
    />
  );
};
