import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { TripType } from "../../../_feature/TripCard/TripCard";
import { Input } from "@nextui-org/react";

export const EditField = ({ info }: { info: Cell<TripType, ReactNode> }) => {
  return <Input variant="underlined" />;
};
