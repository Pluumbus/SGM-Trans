import { Cell } from "@tanstack/react-table";
import { ReactNode, useState, useEffect } from "react";
import { Checkbox } from "@nextui-org/react";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { useMutation } from "@tanstack/react-query";
import { editCargo, editWHCargo } from "./api";
import { useTableMode } from "../TableMode.context";

export const CheckboxField = ({
  info,
}: {
  info: Cell<CargoType, ReactNode>;
}) => {
  const [state, setState] = useState<boolean>(info.getValue() as boolean);
  const [debouncedValue, setDebouncedValue] = useState<boolean>(state);

  useEffect(() => {
    if (info && state != info.getValue()) {
      setState(info.getValue() as boolean);
    }
  }, [info.getValue()]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await editCargo(
        info.column.columnDef.accessorKey as string,
        debouncedValue,
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
        debouncedValue,
        info.row.original.id
      );
    },
  });

  const { tableMode } = useTableMode();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(state);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state]);

  useEffect(() => {
    if (debouncedValue !== (info.getValue() as boolean)) {
      tableMode == "cargo" ? mutate() : mutateWHCargo();
    }
  }, [debouncedValue]);

  return (
    <div className="min-w-fit max-h-fit flex justify-center items-center">
      <Checkbox
        aria-label={`checkbox ${info.column.id} ${info.row.original.id}`}
        isSelected={state}
        onValueChange={setState}
      />
    </div>
  );
};
