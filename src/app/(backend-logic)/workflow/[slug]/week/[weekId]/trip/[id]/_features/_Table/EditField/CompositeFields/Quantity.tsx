import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { QUANTITY_TYPE, QuantityType } from "@/lib/references";

type Type = CargoType["quantity"];

export const Quantity = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  return (
    <div className="flex flex-col gap-2  w-[8rem]">
      <Textarea
        variant="underlined"
        aria-label="Quantity textarea"
        className="w-8rem]"
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
            type: e as QuantityType,
          }));
        }}
      >
        {QUANTITY_TYPE.map((e) => (
          <AutocompleteItem key={e} textValue={e} className="w-[8rem]">
            {e}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
