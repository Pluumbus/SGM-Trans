import { Cell } from "@tanstack/react-table";
import { ReactNode, useState, useEffect } from "react";
import { Textarea } from "@nextui-org/react";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { useMutation } from "@tanstack/react-query";
import { editCargo, editWHCargo } from "./api";
import { useTableMode } from "../TableMode.context";

export const Text = ({
  info,
  cl,
}: {
  info: Cell<CargoType, ReactNode>;
  cl?: string;
}) => {
  const [state, setState] = useState<string>(info.getValue()?.toString() || "");

  useEffect(() => {
    if (info && state != info.getValue()) {
      setState(info.getValue()?.toString() || "");
    }
  }, [info.getValue()]);

  const [debouncedValue, setDebouncedValue] = useState<string>(state);

  const { mutate: mutateWHCargo } = useMutation({
    mutationFn: async () => {
      await editWHCargo(
        info.column.columnDef.accessorKey,
        debouncedValue,
        info.row.original.id
      );
    },
  });
  const { mutate } = useMutation({
    mutationFn: async () => {
      await editCargo(
        info.column.columnDef.accessorKey,
        debouncedValue,
        info.row.original.id
      );
    },
  });

  const { tableMode } = useTableMode();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(state);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [state]);

  useEffect(() => {
    if (debouncedValue !== info.getValue()?.toString()) {
      tableMode == "wh-cargo" ? mutateWHCargo() : mutate();
    }
  }, [debouncedValue]);

  return (
    <div
      className={`max-h-[120px] min-w-20 w-full h-full flex items-end ${cl}`}
    >
      <Textarea
        aria-label={`text ${info.column.columnDef.accessorKey.toString()}`}
        variant="underlined"
        className="w-full"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  );
};
