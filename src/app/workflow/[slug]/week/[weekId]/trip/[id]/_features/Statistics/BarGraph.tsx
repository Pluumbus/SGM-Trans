"use client";

import { CargoType } from "@/app/workflow/_feature/types";
import { Chart } from "./ShadBar";

export const BarGraph = ({
  cargos,
  currentTrip,
}: {
  cargos: CargoType[];
  currentTrip: number;
}) => {
  return (
    <div>
      <Chart cargos={cargos} currentTrip={currentTrip} />
    </div>
  );
};
