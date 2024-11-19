import { TM } from "@/app/(backend-logic)/workflow/_feature/TransportationManagerActions";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { useMutation } from "@tanstack/react-query";
import { Cell } from "@tanstack/react-table";
import React, { ReactNode, useEffect, useState } from "react";
import { editCargo } from "../api";

type Type = CargoType["transportation_manager"];

export const TransportationManager = ({
  info,
}: {
  info: Cell<CargoType, ReactNode>;
}) => {
  const state = useState<Type>(Number(info.getValue()));

  useEffect(() => {
    if (info && state != info.getValue()) {
      state[1](Number(info.getValue()));
    }
  }, [info.getValue()]);

  const [debouncedValue, setDebouncedValue] = useState<Type>(state[0]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await editCargo(
        // @ts-ignore
        info.column.columnDef!.accessorKey,
        debouncedValue,
        info.row.original.id
      );
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(state[0]);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state]);

  useEffect(() => {
    if (debouncedValue !== Number(info.getValue())) {
      mutate();
    }
  }, [debouncedValue]);

  return (
    <div className="min-w-[500px]">
      <TM state={state} type="Table" info={info} />
    </div>
  );
};
