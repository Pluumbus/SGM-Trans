"use client";

import { NextPage } from "next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Accordion, AccordionItem, Divider, Spinner } from "@nextui-org/react";
import { getCars } from "@/lib/references/drivers/feature/api";

import { getAllVehiclesStatistics } from "./_api/requests";
import {
  ReportStatisticsType,
  VehicleReportStatisticsType,
} from "./_api/types";
import { CarCard } from "./_features/CarCard";
import { ManageDetail } from "./_features/Modals";
import { DisclosureProvider } from "./_features/DisclosureContext";
import { useEffect, useState } from "react";
import { CarsType } from "@/lib/references/drivers/feature/types";
import supabase from "@/utils/supabase/client";

interface Props {}

type CarsWithOmnicommType = CarsType & {
  omnicommData: ReportStatisticsType["data"]["vehicleDataList"];
};

const Page: NextPage<Props> = () => {
  const [cars, setCars] = useState<CarsType[] | CarsWithOmnicommType[]>([]);

  const { isPending, mutate } = useMutation({
    mutationKey: ["get cars ls"],
    mutationFn: async () => await getCars("truck"),
    onSuccess: (data) => {
      setCars(data);
    },
    retry: (failureCount, error) => (error ? true : false),
  });

  const { data: omnicommCars, isLoading: isLoadingOmicomm } = useQuery({
    queryKey: ["get omnicomm cars"],
    queryFn: async () =>
      await getAllVehiclesStatistics().then(
        (data) => data.data.vehicleDataList
      ),
  });

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    const cn = supabase
      .channel(`view-cars`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cars",
        },
        (payload) => {
          const updatedTrip = payload.new as CarsType;
          setCars((prev) => {
            const updatedTrips = prev.map((e) =>
              e.id === updatedTrip.id ? updatedTrip : e
            );
            return updatedTrips;
          });
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  if (isPending || isLoadingOmicomm) {
    return <Spinner />;
  }

  return (
    <DisclosureProvider>
      <Accordion
        className="grid grid-cols-4 gap-4"
        showDivider={false}
        selectionMode="single"
      >
        {cars
          ?.sort((a, b) => {
            const carComparison = a.car.localeCompare(b.car);
            if (carComparison !== 0) {
              return carComparison;
            }
            return a.state_number.localeCompare(b.state_number);
          })
          .map((e) => (
            <AccordionItem
              key={e.id}
              aria-label={`Accordion ${e.id}`}
              className="border border-gray-600 pr-2"
              title={
                <div className="justify-between">
                  <div className="flex p-3 w-full gap-2 items-center h-full subpixel-antialiased">
                    <span className="font-semibold">{e.car}</span>
                    <Divider
                      orientation="vertical"
                      className="h-auto min-h-6"
                    />
                    <span className="text-sm text-center">
                      {e.state_number}
                    </span>
                  </div>
                </div>
              }
            >
              <CarCard
                key={`CarCard ${e.id}`}
                car={{
                  ...e,
                  omnicommData: omnicommCars?.find(
                    (el) =>
                      el.name !== "D" &&
                      el.vehicleID.toString() == e.omnicomm_uuid
                  ) as VehicleReportStatisticsType,
                }}
              />
            </AccordionItem>
          ))}
      </Accordion>
      <ManageDetail />
    </DisclosureProvider>
  );
};

export default Page;
