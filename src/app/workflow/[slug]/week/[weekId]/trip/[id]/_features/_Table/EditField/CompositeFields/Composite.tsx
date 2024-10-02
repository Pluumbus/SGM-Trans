import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { CargoType } from "@/app/workflow/_feature/types";
import { Amount } from "./Amount";
import { UnloadingPoint } from "./UnloadingPoint";
import { Quantity } from "./Quantity";
import { Driver } from "./Driver";
import { Status } from "./Status";

export const Composite = ({
  info,
  type,
}: {
  info: Cell<CargoType, ReactNode>;
  type: "unloading_point" | "quantity" | "driver" | "amount" | "status";
}) => {
  switch (type) {
    case "amount":
      return <Amount info={info} />;
    case "unloading_point":
      return <UnloadingPoint info={info} />;
    case "quantity":
      return <Quantity info={info} />;
    case "driver":
      return <Driver info={info} />;
    case "status":
      return <Status info={info} />;
    default:
      return <Amount info={info} />;
  }
};
