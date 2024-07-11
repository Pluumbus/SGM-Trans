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

export const TripCard = () => {
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

  const mMockData = useMemo(() => {
    return mockData;
  }, []);

  return (
    <div>
      <UTable
        data={mMockData}
        columns={columns}
        name="Cargo Table"
        config={config}
      />
    </div>
  );
};

const mockData: Array<TripType> = [
  {
    trip_number: "1",
    amount: "1800000 тг",
    quantity: "70 шт",
    volume: "180 кубов",
    weight: "80 кг",
  },
  {
    trip_number: "2",
    amount: "8900000 тг",
    quantity: "70 шт",
    volume: "180 кубов",
    weight: "70 кг",
  },
  {
    trip_number: "3",
    amount: "2900000 тг",
    quantity: "70 шт",
    volume: "180 кубов",
    weight: "80 кг",
  },
];
