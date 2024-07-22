import { Cell } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import { Textarea } from "@nextui-org/react";
import { CargoType } from "@/app/workflow/_feature/types";

export const Text = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div
      className="max-h-fit min-w-20"
      onClick={() => {
        setIsEditing((prev) => !prev);
      }}
    >
      {isEditing ? (
        <Textarea
          variant="underlined"
          className="min-w-20"
          defaultValue={info.getValue()?.toString()}
        />
      ) : (
        <span>{info.getValue()?.toString()}</span>
      )}
    </div>
  );
};
