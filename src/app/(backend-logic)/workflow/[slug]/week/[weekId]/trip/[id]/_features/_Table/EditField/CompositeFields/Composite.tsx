import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { Amount } from "./Amount";
import { UnloadingPoint } from "./UnloadingPoint";
import { Quantity } from "./Quantity";
import { Driver } from "./Driver";
import { Status } from "./Status";
import { PrintAct } from "./PrintAct";
import { ClientBin } from "./ClientBin";

export const Composite = ({
  info,
  type,
}: {
  info: Cell<CargoType, ReactNode>;
  type:
    | "unloading_point"
    | "quantity"
    | "driver"
    | "amount"
    | "client_bin"
    | "status"
    | "is_act_ready";
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
    case "is_act_ready":
      return <PrintAct info={info} />;
    case "client_bin":
      return <ClientBin info={info} />;
    default:
      return <Amount info={info} />;
  }
};
