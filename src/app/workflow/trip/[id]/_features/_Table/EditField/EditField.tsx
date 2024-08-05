import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { CargoType } from "@/app/workflow/_feature/types";
import { CheckboxField } from "./Checkbox";
import { Text } from "./Text";
import { DateField } from "./Date";

export const EditField = ({
  info,
  type,
}: {
  info: Cell<CargoType, ReactNode>;
  type: "Date" | "Text" | "Checkbox";
}) => {
  switch (type) {
    case "Checkbox":
      return <CheckboxField info={info} />;
    case "Text":
      return <Text info={info} />;
    case "Date":
      return <DateField info={info} />;
    default:
      return <Text info={info} />;
  }
};
