import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Textarea,
} from "@nextui-org/react";
import { PRICE_TYPE, PriceType } from "@/lib/references";

type Type = CargoType["amount"];

export const Amount = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  return (
    <div className="flex gap-2 w-[20rem]">
      <Textarea
        variant="underlined"
        aria-label="Amount Textarea"
        value={values.value}
        onChange={(e) => {
          setValues((prev) => ({
            ...prev,
            value: e.target.value,
          }));
        }}
      />
      <Autocomplete
        aria-label="Amount Autocomplete"
        variant="underlined"
        selectedKey={values.type}
        onSelectionChange={(e) => {
          setValues((prev) => ({
            ...prev,
            type: e.toString() as PriceType,
          }));
        }}
      >
        {PRICE_TYPE.map((e) => (
          <AutocompleteItem key={e} textValue={e}>
            {e}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
