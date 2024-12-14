import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { Checkbox, Textarea, Tooltip } from "@nextui-org/react";
import { Cities } from "@/lib/references";

type Type = CargoType["unloading_point"];

export const UnloadingPoint = ({
  info,
}: {
  info: Cell<CargoType, ReactNode>;
}) => {
  const [values, setValues] = useCompositeStates<Type>(info);

  return (
    <div className="flex flex-col gap-2 w-[8rem]">
      <div className={`flex gap-2 ${!values.withDelivery && "flex-col"}`}>
        <Cities
          variant="underlined"
          aria-label="Cities lib"
          selectedKey={values.city}
          isClearable={false}
          onSelectionChange={(e) => {
            setValues((prev) => ({
              ...prev,
              city: e.toString(),
            }));
          }}
        />
        <Tooltip content="С доставкой?">
          <Checkbox
            isSelected={values.withDelivery}
            onValueChange={(e) => {
              setValues((prev) => ({
                ...prev,
                withDelivery: e,
              }));
            }}
          ></Checkbox>
        </Tooltip>
      </div>
      {values.withDelivery && (
        <Textarea
          aria-label="Unlodaing place textarea"
          variant="underlined"
          value={values.deliveryAddress}
          onChange={(e) => {
            setValues((prev) => ({
              ...prev,
              deliveryAddress: e.target.value,
            }));
          }}
        />
      )}
    </div>
  );
};
