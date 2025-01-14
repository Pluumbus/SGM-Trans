import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { CheckboxField } from "./Checkbox";
import { Text } from "./Text";
import { DateField } from "./Date";
import { Lib } from "./Ref";
import { Composite } from "./CompositeFields";

export const EditField = ({
  info,
  type,
  compositeType,
  cl,
}: {
  cl?: string;
  info: Cell<CargoType, ReactNode>;
  type: "Date" | "Text" | "Checkbox" | "Ref" | "Composite";
  compositeType?:
    | "unloading_point"
    | "quantity"
    | "driver"
    | "amount"
    | "client_bin"
    | "status"
    | "address"
    | "act_details"
    | "transportation_manager";
}) => {
  switch (type) {
    case "Checkbox":
      return <CheckboxField info={info} />;
    case "Text":
      return <Text info={info} cl={cl} />;
    case "Date":
      return <DateField info={info} />;
    case "Ref":
      return <Lib info={info} />;
    case "Composite":
      return <Composite info={info} type={compositeType} />;
    default:
      return <Text info={info} />;
  }
};
