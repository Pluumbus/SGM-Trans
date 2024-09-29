import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { Checkbox, Textarea } from "@nextui-org/react";
import { Cities } from "@/lib/references";

type Type = CargoType["unloading_point"];

export const Driver = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  return (
    <div>
      <Cities
        variant="underlined"
        aria-label="Driver Cities"
        selectedKey={values.city}
        onSelectionChange={(e) => {
          setValues((prev) => ({
            ...prev,
            city: e.toString(),
          }));
        }}
      />
      <Checkbox
        isSelected={values.withDelivery}
        onSelect={() => {
          setValues((prev) => ({
            ...prev,
            withDelivery: !prev.withDelivery,
          }));
        }}
      >
        С доставкой
      </Checkbox>

      <Textarea
        variant="underlined"
        aria-label="Driver Textarea"
        value={values.deliveryAddress}
        onChange={(e) => {
          setValues((prev) => ({
            ...prev,
            deliveryAddress: e.target.value,
          }));
        }}
      />
    </div>
  );
};
