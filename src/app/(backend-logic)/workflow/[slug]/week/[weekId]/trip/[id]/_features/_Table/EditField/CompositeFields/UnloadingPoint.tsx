import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { Checkbox, Textarea, Tooltip } from "@nextui-org/react";
import { Cities } from "@/lib/references";
import { cx } from "class-variance-authority";
import { useTableMode } from "../../TableMode.context";

type Type = CargoType["unloading_point"];

export const UnloadingPoint = ({
  info,
}: {
  info: Cell<CargoType, ReactNode>;
}) => {
  const [values, setValues, isLoading] = useCompositeStates<Type>(info);
  const { tableMode } = useTableMode();
  const isWH = tableMode == "wh-cargo";

  return (
    <div className={cx("flex flex-col gap-2 ", isWH ? "w-full" : "w-[8rem]")}>
      <div className={cx(`flex gap-2 `, !values?.withDelivery && "flex-col")}>
        <Cities
          variant="underlined"
          aria-label="Cities lib"
          isDisabled={isLoading}
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
            isDisabled={isLoading}
            isSelected={values.withDelivery}
            onValueChange={(e) => {
              setValues((prev) => ({
                ...prev,
                withDelivery: e,
              }));
            }}
          >
            {!values?.withDelivery && "С доставкой?"}
          </Checkbox>
        </Tooltip>
      </div>
      {values.withDelivery && (
        <Textarea
          isDisabled={isLoading}
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
