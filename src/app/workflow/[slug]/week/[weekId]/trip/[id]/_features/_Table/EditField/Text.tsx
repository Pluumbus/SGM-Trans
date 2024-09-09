import { Cell } from "@tanstack/react-table";
import { ReactNode, useState, useEffect } from "react";
import { Textarea } from "@nextui-org/react";
import { CargoType } from "@/app/workflow/_feature/types";
import { useMutation } from "@tanstack/react-query";
import { editCargo } from "./api";

export const Text = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [state, setState] = useState<string>(info.getValue()?.toString() || "");

  useEffect(() => {
    if (info) {
      setState(info.getValue()?.toString() || "");
    }
  }, [info]);

  const [debouncedValue, setDebouncedValue] = useState<string>(state);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await editCargo(
        info.column.columnDef.accessorKey,
        debouncedValue,
        info.row.original.id
      );
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(state);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state]);

  useEffect(() => {
    if (debouncedValue !== info.getValue()?.toString()) {
      mutate();
    }
  }, [debouncedValue]);

  return (
    <div className="max-h-fit min-w-20">
      <Textarea
        variant="underlined"
        className="min-w-20"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  );
};
