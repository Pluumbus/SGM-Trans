import { TM } from "@/app/(backend-logic)/workflow/_feature/TransportationManagerActions";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { useMutation } from "@tanstack/react-query";
import { Cell } from "@tanstack/react-table";
import React, { ReactNode, useEffect, useState } from "react";
import { editCargo } from "../api";
import { useCompositeStates } from "./helpers";

type Type = CargoType["transportation_manager"];

export const TransportationManager = ({
  info,
}: {
  info: Cell<CargoType, ReactNode>;
}) => {
  const state = useCompositeStates<Type>(info);

  return (
    <div className="min-w-[250px]">
      <TM state={state} type="Table" info={info} />
    </div>
  );
};
