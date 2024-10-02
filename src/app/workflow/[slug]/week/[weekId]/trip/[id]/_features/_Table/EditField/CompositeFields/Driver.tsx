import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { Textarea } from "@nextui-org/react";
import { DriversWithCars } from "@/lib/references";

type Type = CargoType["driver"];

export const Driver = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  return (
    <div className="min-w-[15rem]">
      <DriversWithCars
        variant="underlined"
        aria-label="Driver Cities"
        selectedKey={values.id}
        onSelectionChange={(e) => {
          setValues((prev) => ({
            ...prev,
            id: e.toString(),
          }));
        }}
      />
      {values.id == "24" && (
        <Textarea
          variant="underlined"
          aria-label="Driver Textarea"
          label="Сумма оплаты наемнику"
          value={values.value}
          onChange={(e) => {
            setValues((prev) => ({
              ...prev,
              value: e.target.value,
            }));
          }}
        />
      )}
    </div>
  );
};
