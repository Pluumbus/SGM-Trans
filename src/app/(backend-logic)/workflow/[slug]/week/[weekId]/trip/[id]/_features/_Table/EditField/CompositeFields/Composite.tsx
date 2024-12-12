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
import { TransportationManager } from "./TransportationManager";
import { Address } from "./Address";

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
    | "address"
    | "act_details"
    | "transportation_manager";
}) => {
  switch (type) {
    case "amount":
      return <Amount info={info} />;
    case "transportation_manager":
      return <TransportationManager info={info} />;
    case "unloading_point":
      return <UnloadingPoint info={info} />;
    case "address":
      return <Address info={info} />;
    case "quantity":
      return <Quantity info={info} />;
    case "driver":
      return <Driver info={info} />;
    case "status":
      return <Status info={info} />;
    case "act_details":
      return <PrintAct info={info} />;
    case "client_bin":
      return <ClientBin info={info} />;
    default:
      return <Amount info={info} />;
  }
};
