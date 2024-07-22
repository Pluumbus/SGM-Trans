"use client";
import { useMemo } from "react";
import { getBaseTripColumnsConfig } from "./TripTable.config";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { UTable } from "@/tool-kit/ui";
import { useRouter } from "next/navigation";

export type TripType = {
  trip_number: string;
  week_id: string;
  weight: string;
  volume: string;
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

  // Trip w/o weeks
  const getCleanTrip = (trips) => {
    return trips.map((e) => {
      delete e.weeks;
      return e;
    });
  };

  return (
    <div>
      <pre>{JSON.stringify(getCleanTrip(trips), null, 2)}</pre>
      <UTable
        data={trips}
        columns={columns}
        name="Cargo Table"
        config={config}
      />
    </div>
  );
};
