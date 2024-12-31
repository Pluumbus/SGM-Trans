import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { QuantityType } from "@/lib/references";

type Type = CargoType["quantity"];

export const Quantity = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  return (
    <div className="flex flex-col gap-2  w-[4rem]">
      <Textarea
        variant="underlined"
        aria-label="Quantity textarea"
        className="w-full"
        value={values?.value}
        onChange={(e) => {
          setValues((prev) => ({
            ...prev,
            value: e.target.value,
          }));
        }}
      />
      <Tooltip content={values?.type}>
        <Input
          variant="underlined"
          isClearable={false}
          aria-label="Quantity Autocomplete"
          value={values?.type}
          onChange={(e) => {
            setValues((prev) => ({
              ...prev,
              type: e.target.value as QuantityType,
            }));
          }}
        />
      </Tooltip>
    </div>
  );
};
