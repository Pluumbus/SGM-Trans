"use client";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { getBaseTripColumnsConfig } from "./TripTable.config";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { UTable } from "@/tool-kit/ui";
import { useParams, usePathname, useRouter } from "next/navigation";
import { CargoType, WeekType } from "../types";
import { useQuery } from "@tanstack/react-query";

import { Spinner } from "@nextui-org/react";
import supabase from "@/utils/supabase/client";
import {
  getTripsByWeekId,
  getCargosByTripId,
} from "../../[slug]/week/[weekId]/trip/_api/index";

export type TripType = {
  id: number;
  user_id: string;
  week_id: string;
  driver: string;
  city_from: string[];
  city_to: string[];
  status: string;
};

export const TripCard = ({
  weekId,
  setWeeks,
}: {
  weekId: string;
  setWeeks: Dispatch<SetStateAction<(WeekType & { trips: TripType[] })[]>>;
}) => {
  const columns = useMemo(() => getBaseTripColumnsConfig(), []);
  const pathname = usePathname();
  const router = useRouter();

  const { data: tripsData, isLoading } = useQuery({
    queryKey: [`trips/${weekId}`],
    queryFn: async () => await getTripsByWeekId(weekId),
  });

  const [trips, setTrips] = useState([]);

  const { slug } = useParams();

  useEffect(() => {
    if (!isLoading && tripsData.length > trips.length) {
      setTrips(tripsData);
    }
  }, [isLoading, tripsData]);

  const config: UseTableConfig<CargoType & { trips: TripType }> = {
    row: {
      setRowData(info) {
        router.push(`${pathname}/week/${weekId}/trip/${info.original.id}`);
      },
      className: "cursor-pointer",
    },
  };

  const getSummaryFromCargos = (cargos: CargoType[]) => {
    return {
      ...cargos.reduce(
        (acc, curr) => {
          acc.id = curr.trip_id.toString();
          acc.volume += Number(curr.volume) || 0;
          acc.amount += Number(curr.amount) || 0;
          acc.quantity += Number(curr.quantity) || 0;
          return acc;
        },
        { id: "", volume: 0, amount: 0, quantity: 0 }
      ),
    };
  };

  useEffect(() => {
    const cn = supabase
      .channel(`view-trips-${slug}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips" },
        (payload) => {
          setTrips((prev) => [...prev, payload.new]);
          setWeeks((prev) =>
            prev.map((week) => {
              if (week.id === payload.new!.week_id) {
                const newTrip = payload.new as TripType;
                const updatedTrips = week.trips.some(
                  (trip) => trip.id === newTrip.id
                )
                  ? week.trips.map((trip) =>
                      trip.id === newTrip.id ? newTrip : trip
                    )
                  : [...week.trips, newTrip];

                return { ...week, trips: updatedTrips };
              }
              return week;
            })
          );
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  const getCargosFromTripIdAndSummarize = async (trip_id) => {
    const data = await getCargosByTripId(trip_id);
    return getSummaryFromCargos(data);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <UTable
        data={trips.map((e, i) => ({
          ...e,
          number: i + 1,
        }))}
        columns={columns}
        name={`Cargo Table ${weekId}`}
        config={config}
      />
    </div>
  );
};
