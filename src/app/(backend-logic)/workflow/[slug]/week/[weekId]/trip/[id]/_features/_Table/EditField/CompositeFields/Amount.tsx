import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { PRICE_TYPE, PriceType } from "@/lib/references";

type Type = CargoType["amount"];

export const Amount = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  return (
    <div className="flex flex-col gap-2 w-[5rem]">
      <Textarea
        variant="underlined"
        className="w-full"
        aria-label="Amount Textarea"
        value={values?.value}
        onChange={(e) => {
          setValues((prev) => ({
            ...prev,
            value: e.target.value,
          }));
        }}
      />
      <Tooltip content={<span>{values?.type}</span>}>
        <Autocomplete
          isClearable={false}
          aria-label="Amount Autocomplete"
          variant="underlined"
          selectedKey={values?.type}
          onSelectionChange={(e) => {
            setValues((prev) => ({
              ...prev,
              type: e?.toString() as PriceType,
            }));
          }}
        >
          {PRICE_TYPE.map((e) => (
            <AutocompleteItem key={e} textValue={e}>
              <Tooltip content={<span>{e}</span>}>{e.slice(0, 3)}</Tooltip>
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </Tooltip>
    </div>
  );
};
