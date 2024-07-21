import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { CargoType } from "@/app/workflow/_feature/types";
import { parseDate } from "@internationalized/date";

export const DateField = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  return (
    <div className="min-w-fit max-h-fit">
      <DatePicker
        variant="underlined"
        defaultValue={parseDate(info.getValue())}
      />
    </div>
  );
};
