import { Cell } from "@tanstack/react-table";
import { ReactNode, useState, useEffect, Key } from "react";
import { Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { CargoType } from "@/app/workflow/_feature/types";
import { useMutation } from "@tanstack/react-query";
import { editCargo } from "./api";

type State = {
  value: string | null;
  key: string | null;
};

export const Composite = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [inputState, setInputState] = useState<string>(
    info.getValue()?.value || "",
  );
  const [refState, setRefState] = useState<string>(info.getValue()?.key || "");

  useEffect(() => {
    if (info.getValue()?.value !== inputState) {
      setInputState(info.getValue()?.value);
    }
    if (info.getValue()?.key !== refState) {
      setRefState(info.getValue()?.key);
    }
  }, [info.getValue()]);

  const [debouncedValue, setDebouncedValue] = useState<State>({
    value: inputState,
    key: refState,
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      await editCargo(
        info.column.columnDef.accessorKey,
        debouncedValue,
        info.row.original.id,
      );
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue({
        value: inputState,
        key: refState,
      });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputState, refState]);

  useEffect(() => {
    if (
      debouncedValue.value !== info.getValue()?.value ||
      debouncedValue.key !== info.getValue()?.key
    ) {
      mutate();
    }
  }, [debouncedValue]);

  return (
    <div className="max-h-fit min-w-20 flex  items-center">
      <Textarea
        variant="underlined"
        aria-label={`text ${info.column.columnDef.accessorKey.toString()}`}
        className="min-w-20 "
        value={inputState}
        onChange={(e) => {
          setInputState(e.target.value);
        }}
      />
      <Autocomplete
        variant="underlined"
        className="min-w-[8rem]"
        aria-label={`ref ${info.column.columnDef.accessorKey.toString()}`}
        selectedKey={refState}
        onSelectionChange={(e) => {
          setRefState(e);
        }}
      >
        <AutocompleteItem key={"Палеты"} textValue="Палеты">
          Палеты
        </AutocompleteItem>
        <AutocompleteItem key={"Коробки"} textValue="Коробки">
          Коробки
        </AutocompleteItem>
      </Autocomplete>
    </div>
  );
};
