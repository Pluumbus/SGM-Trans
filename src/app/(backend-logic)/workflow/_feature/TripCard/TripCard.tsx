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
  driver: { driver: string; car: string; state_number: string };
  city_from: string[];
  city_to: string[];
  status: string;
  date_in: string;
  date_out: string;
  trip_number: number;
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

  const [trips, setTrips] = useState<TripType[]>([]);

  const { slug } = useParams();

  useEffect(() => {
    if (!isLoading && tripsData.length > trips.length) {
      setTrips(tripsData);
    }
  }, [isLoading, tripsData]);

  const config: UseTableConfig<TripType & { weeks: WeekType }> = {
    row: {
      setRowData(info) {
        router.push(
          `${pathname}/week/${weekId}/trip/${info.original.trip_number}`,
        );
      },
      setClassNameOnRow: (info) => "cursor-pointer",
      className: "cursor-pointer",
    },
  };

  useEffect(() => {
    const cn = supabase
      .channel(`view-trips-${slug}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips" },
        (payload) => {
          setTrips((prev) => [...prev, payload.new as TripType]);
          setWeeks((prev) =>
            prev.map((week) => {
              if (week.id === payload.new!.week_id) {
                const newTrip = payload.new as TripType;
                const updatedTrips = week.trips.some(
                  (trip) => trip.id === newTrip.id,
                )
                  ? week.trips.map((trip) =>
                      trip.id === newTrip.id ? newTrip : trip,
                    )
                  : [...week.trips, newTrip];

                return { ...week, trips: updatedTrips };
              }
              return week;
            }),
          );
        },
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <UTable
        data={trips
          .map((e, i) => ({
            ...e,
            number: i + 1,
          }))
          .sort((a, b) => a.trip_number - b.trip_number)}
        columns={columns}
        name={`Cargo Table ${weekId}`}
        config={config}
      />
    </div>
  );
};
