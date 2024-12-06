"use client";

import { NextPage } from "next";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionItem,
  Divider,
  Input,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
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
import { DetailIcon } from "./_features/CarCard/DetailIcon";
import { getSeparatedNumber } from "@/tool-kit/hooks";
import { IoSwapVerticalOutline } from "react-icons/io5";
import { FaX } from "react-icons/fa6";

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
      await getAllVehiclesStatistics().then((data) => {
        console.log("data from getAllVehiclesStatistics", data);
        return data.data.vehicleDataList;
      }),
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
        className="grid grid-cols-3 gap-4"
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
              title={<ItemTitle e={e} />}
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

const ItemTitle = ({ e }: { e: CarsType }) => {
  console.log(e.details.accumulator?.last_swap);

  return (
    <div className="w-full h-full flex flex-col gap-2 p-3">
      <div className="flex justify-between">
        <div className="flex w-full gap-2 items-center h-full subpixel-antialiased">
          <span className="font-semibold">{e.car}</span>
          <Divider orientation="vertical" className="h-auto min-h-6" />
          <span className="text-sm text-center">{e.state_number}</span>
          {e.details?.temp_can_mileage && (
            <>
              <Divider orientation="vertical" className="h-auto min-h-6" />
              <span className="text-sm text-center font-semibold">
                {e.details.temp_can_mileage || ""}&nbsp;км
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-2 text-xs">
        {e.details.details.map((el) => (
          <>
            <div className="flex flex-col gap-1 items-center justify-center">
              <span>
                <DetailIcon name={el.name} />
              </span>
              <span>
                {getSeparatedNumber(
                  Number(e.details.temp_can_mileage) -
                    Number(el.mileage.last_mileage)
                )}
              </span>
            </div>
            <Divider orientation="vertical" className="h-auto min-h-3" />
          </>
        ))}
        {e.details.accumulator.last_swap == null ? (
          <Tooltip content="Аккумуляторы не меняли местами" showArrow>
            <div className="flex flex-col gap-1 items-center justify-center">
              <span>
                <IoSwapVerticalOutline size={20} />
              </span>
              <span>
                <FaX />
              </span>
            </div>
          </Tooltip>
        ) : (
          <div className="flex flex-col gap-1 items-center justify-center">
            <span>
              <IoSwapVerticalOutline size={20} />
            </span>
            <span>
              {new Date(e.details.accumulator?.last_swap).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
