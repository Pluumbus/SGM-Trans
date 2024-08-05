"use client";
import { Cell } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { CargoType } from "@/app/workflow/_feature/types";
import { CalendarDate, parseDate } from "@internationalized/date";
import { Input } from "@nextui-org/react";

export const DateField = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [date, setDate] = useState<string>(
    new Date(info.getValue()?.toString()).toLocaleDateString()
  );
  return (
    <div className="min-w-fit max-h-fit">
      <Input value={date} variant="underlined" />
    </div>
  );
};
