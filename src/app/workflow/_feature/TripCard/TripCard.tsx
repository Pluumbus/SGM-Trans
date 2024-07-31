"use client";
import { useMemo } from "react";
import { getBaseTripColumnsConfig } from "./TripTable.config";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { UTable } from "@/tool-kit/ui";
import { useRouter } from "next/navigation";
import { CargoType } from "../types";

export type TripType = {
  trip_number: string;
  week_id: string;
  weight: string;
  volume: string;
  payment: string;
  quantity: string;
  amount: string;
};

export const TripCard = ({ trips }: { trips: TripType[] }) => {
  const columns = useMemo(() => getBaseTripColumnsConfig(), []);
  const router = useRouter();

  const config: UseTableConfig<TripType> = {
    row: {
      setRowData(info) {
        router.push(`/workflow/trip/${info.original.trip_number}`);
      },
      className: "cursor-pointer",
    },
  };

  const extractCargos = (
    trips
  ): Array<{
    cargos: CargoType[];
    trip_number: string;
  }> => {
    return trips.map((e) => {
      return {
        cargos: e.cargos,
        trip_number: e.id,
      };
    });
  };

  const getSummaryFromCargos = (data: {
    cargos: CargoType[];
    trip_number: string;
  }) => {
    return {
      trip_number: data.trip_number,
      ...data.cargos.reduce(
        (acc, curr) => {
          acc.volume += curr.volume;
          acc.amount += curr.amount;
          acc.payment += curr.payment;
          acc.quantity += curr.quantity;
          return acc;
        },
        { volume: "", amount: "", payment: "", quantity: "" }
      ),
    };
  };

  return (
    <div>
      <UTable
        data={extractCargos(trips).map((e) => getSummaryFromCargos(e))}
        columns={columns}
        name="Cargo Table"
        config={config}
      />
    </div>
  );
};
