"use client";
import { Cell } from "@tanstack/react-table";
import { ReactNode, useState, useEffect } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { DateValue, parseDate } from "@internationalized/date";
import { useMutation } from "@tanstack/react-query";
import { editCargo } from "./api";
import { formatDate } from "@/lib/helpers";

export const DateField = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [date, setDate] = useState<DateValue>(
    parseDate(formatDate(new Date(info.getValue()?.toString()).toISOString())),
  );
  const [debouncedDate, setDebouncedDate] = useState<DateValue>(date);

  useEffect(() => {
    if (info && date.toString() != info.getValue()) {
      setDate(
        parseDate(
          formatDate(new Date(info.getValue()?.toString()).toISOString()),
        ),
      );
    }
  }, [info.getValue()]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await editCargo(
        info.column.columnDef.accessorKey as string,
        debouncedDate.toString(),
        info.row.original.id,
      );
    },
    onError: (error) => {
      console.error("Failed to update cargo:", error);
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDate(date);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [date]);

  useEffect(() => {
    if (
      debouncedDate.toString() !==
      formatDate(new Date(info.getValue()?.toString()).toISOString())
    ) {
      mutate();
    }
  }, [debouncedDate]);

  return (
    <div className="min-w-fit max-h-fit">
      <DatePicker
        value={date}
        onChange={setDate}
        variant="bordered"
        aria-label={`date ${info.column.columnDef.accessorKey.toString()}`}
      />
    </div>
  );
};
