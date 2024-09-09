"use client";

import { CargoType } from "@/app/workflow/_feature/types";
import { Chart } from "./ShadBar";

export const BarGraph = ({ cargos }: { cargos: CargoType[] }) => {
  return (
    <div>
      <Chart cargos={cargos} />
    </div>
  );
};
