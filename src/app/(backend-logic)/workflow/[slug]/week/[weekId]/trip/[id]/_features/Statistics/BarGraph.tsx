"use client";

import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { Chart } from "./ShadBar";

export const BarGraph = ({ cargos }: { cargos: CargoType[] }) => {
  return (
    <div>
      <Chart cargos={cargos} />
    </div>
  );
};
