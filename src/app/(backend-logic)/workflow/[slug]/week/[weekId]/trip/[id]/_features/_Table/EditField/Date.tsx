"use client";
import { Cell } from "@tanstack/react-table";
import { ReactNode, useState, useEffect } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { DateValue, parseDate } from "@internationalized/date";
import { useMutation } from "@tanstack/react-query";
import { editCargo, editWHCargo } from "./api";
import { formatDate } from "@/lib/helpers";
import { useTableMode } from "../TableMode.context";

export const DateField = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [date, setDate] = useState<DateValue>(
    parseDate(formatDate(new Date(info.getValue()?.toString()).toISOString()))
  );
  const [debouncedDate, setDebouncedDate] = useState<DateValue>(date);

  useEffect(() => {
    if (info && date.toString() != info.getValue()) {
      setDate(
        parseDate(
          formatDate(new Date(info.getValue()?.toString()).toISOString())
        )
      );
    }
  }, [info.getValue()]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await editCargo(
        info.column.columnDef.accessorKey as string,
        debouncedDate.toString(),
        info.row.original.id
      );
    },
    onError: (error) => {
      console.error("Failed to update cargo:", error);
    },
  });

  const { mutate: mutateWHCargo } = useMutation({
    mutationFn: async () => {
      await editWHCargo(
        info.column.columnDef.accessorKey,
        debouncedDate,
        info.row.original.id
      );
    },
  });

  const { tableMode } = useTableMode();
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
      tableMode == "wh-cargo" ? mutateWHCargo() : mutate();
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
