import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { CargoType } from "@/app/workflow/_feature/types";
import { CheckboxField } from "./Checkbox";
import { Text } from "./Text";
import { DateField } from "./Date";
import { Lib } from "./Ref";
import { Composite } from "./Composite";

export const EditField = ({
  info,
  type,
}: {
  info: Cell<CargoType, ReactNode>;
  type: "Date" | "Text" | "Checkbox" | "Ref" | "Composite";
}) => {
  switch (type) {
    case "Checkbox":
      return <CheckboxField info={info} />;
    case "Text":
      return <Text info={info} />;
    case "Date":
      return <DateField info={info} />;
    case "Ref":
      return <Lib info={info} />;
    case "Composite":
      return <Composite info={info} />;
    default:
      return <Text info={info} />;
  }
};
