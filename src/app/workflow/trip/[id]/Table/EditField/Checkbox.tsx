import { Cell } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import { Checkbox } from "@nextui-org/react";
import { CargoType } from "@/app/workflow/_feature/types";
import { useParams } from "next/navigation";
import { createCargoStore } from "../../_store";

export const CheckboxField = ({
  info,
}: {
  info: Cell<CargoType, ReactNode>;
}) => {
  const [state, setState] = useState<boolean>(info.getValue() as boolean);
  const { id } = useParams() as { id: string };

  const useCargoStore = createCargoStore(id.toString());
  const updateCargo = useCargoStore((state) => state.updateCargo);

  const changeState = (newValue: boolean) => {
    setState(newValue);
    updateCargo(info.row.original.id, {
      [info.column.id]: newValue,
    });
  };

  return (
    <div className="min-w-fit max-h-fit">
      <Checkbox
        aria-label={`checkbox ${info.column.id} ${info.row.original.id}`}
        isSelected={state}
        onValueChange={changeState}
      />
    </div>
  );
};
