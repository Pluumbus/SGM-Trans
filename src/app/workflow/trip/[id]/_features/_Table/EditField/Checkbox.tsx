import { Cell } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import { Checkbox } from "@nextui-org/react";
import { CargoType } from "@/app/workflow/_feature/types";
import { useParams } from "next/navigation";

export const CheckboxField = ({
  info,
}: {
  info: Cell<CargoType, ReactNode>;
}) => {
  const [state, setState] = useState<boolean>(info.getValue() as boolean);
  const { id } = useParams() as { id: string };

  return (
    <div className="min-w-fit max-h-fit">
      <Checkbox
        aria-label={`checkbox ${info.column.id} ${info.row.original.id}`}
        isSelected={state}
        onValueChange={setState}
      />
    </div>
  );
};
