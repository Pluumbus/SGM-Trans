import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { QUANTITY_TYPE, QuantityType } from "@/lib/references";

type Type = CargoType["quantity"];

export const Quantity = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  return (
    <div className="flex gap-2 items-end w-[20rem]">
      <Textarea
        variant="underlined"
        aria-label="Quantity textarea"
        value={values?.value}
        onChange={(e) => {
          setValues((prev) => ({
            ...prev,
            value: e.target.value,
          }));
        }}
      />
      <Autocomplete
        variant="underlined"
        aria-label="Quantity Autocomplete"
        selectedKey={values?.type}
        onSelectionChange={(e) => {
          setValues((prev) => ({
            ...prev,
            key: e as QuantityType,
          }));
        }}
      >
        {QUANTITY_TYPE.map((e) => (
          <AutocompleteItem key={e} textValue={e}>
            {e}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
