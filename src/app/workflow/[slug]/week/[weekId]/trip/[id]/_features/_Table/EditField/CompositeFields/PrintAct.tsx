import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { Checkbox } from "@nextui-org/react";
import { ActType, PrintButton } from "@/components/actPrintTemp/actGen";
import { checkRole } from "@/components/roles/useRole";

type Type = CargoType["is_act_ready"];

export const PrintAct = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [value, setValue] = useCompositeStates<Type>(info);

  const actData: ActType = {
    client_bin: info.row.original.client_bin,
    cargo_name: info.row.original.cargo_name,
    quantity: info.row.original.quantity.value,
    amount: info.row.original.amount.value,
    date: new Date().toLocaleDateString(),
  };

  return (
    <div className="flex flex-col gap-2 w-[8rem]">
      <div className="flex gap-2">
        {checkRole(["Кассир", "Админ"]) && (
          <Checkbox
            isSelected={value}
            onValueChange={(e) => {
              setValue(e);
            }}
          ></Checkbox>
        )}
        {value && <PrintButton actData={actData} />}
      </div>
    </div>
  );
};
