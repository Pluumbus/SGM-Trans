"use client";

import { NextPage } from "next";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionItem,
  Divider,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { getCars } from "@/lib/references/drivers/feature/api";

import { getAllVehiclesCan, getAllVehiclesStatistics } from "./_api/requests";
import {
  ReportStatisticsType,
  ResponseCanData,
  VehicleCan,
  VehicleReportStatisticsType,
} from "./_api/types";
import { ManageDetail } from "./_features/Modals";
import { DisclosureProvider } from "./_features/DisclosureContext";
import { useEffect, useState } from "react";
import {
  CarDetailsType,
  CarsType,
} from "@/lib/references/drivers/feature/types";
import supabase from "@/utils/supabase/client";
import { DetailIcon } from "./_features/CarCard/DetailIcon";
import { getSeparatedNumber } from "@/tool-kit/hooks";
import { IoSwapVerticalOutline } from "react-icons/io5";
import { FaX } from "react-icons/fa6";
import { CarCard } from "./_features/CarCard";
import { CarsWithOmnicommType } from "./_features/CarCard/CarDetailsCard";

interface Props {}

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

  // const { data: omnicommCars, isLoading: isLoadingOmnicomm } = useQuery({
  //   queryKey: ["get omnicomm cars"],
  //   queryFn: async () =>
  //     await getAllVehiclesStatistics().then((data) => data.items),
  //   refetchOnReconnect: false,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  // });

  const { data: omnicommCars, isLoading: isLoadingOmnicomm } = useQuery({
    queryKey: ["TempKey"],
    queryFn: async () => await getAllVehiclesCan().then((d) => d),
    // .then((data) => data.data.vehicleDataList),
  });

  // console.log(omnicommCars);
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

  // console.log(cars, omnicommCars);
  // console.log(
  //   "TEST",
  //   omnicommCars?.find((e) => e[0].vehicleID == 203006761)
  // );
  if (isPending || isLoadingOmnicomm) {
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
          .map(
            (e) =>
              !isLoadingOmnicomm && (
                <AccordionItem
                  key={e.id}
                  aria-label={`Accordion ${e.id}`}
                  className="border border-gray-600 pr-2"
                  title={
                    <ItemTitle
                      e={{
                        ...e,
                        omnicommData: omnicommCars?.find(
                          (el) => el[0].vehicleID == Number(e.omnicomm_uuid)
                        ) as VehicleCan,
                      }}
                    />
                  }
                >
                  <CarCard
                    key={`CarCard ${e.id}`}
                    car={{
                      ...e,
                      omnicommData: omnicommCars?.find(
                        (el) => el[0].vehicleID == Number(e.omnicomm_uuid)
                      ) as VehicleCan,
                    }}
                  />
                </AccordionItem>
              )
          )}
      </Accordion>
      <ManageDetail />
    </DisclosureProvider>
  );
};

const ItemTitle = ({ e }: { e }) => {
  console.log(e);
  return (
    <div key={e.id} className="w-full h-full flex flex-col gap-2 p-3">
      <div className="flex justify-between">
        <div className="flex w-full gap-2 items-center h-full subpixel-antialiased">
          <span className="font-semibold">{e.car}</span>
          <Divider orientation="vertical" className="h-auto min-h-6" />
          <span className="inline-block px-2 py-1 border-2 border-black rounded-md bg-white text-black font-bold text-sm text-center tracking-wider">
            {e.state_number as string}
          </span>
          {e.omnicommData && (
            <>
              <Divider orientation="vertical" className="h-auto min-h-6" />
              <span className="text-sm text-center font-semibold">
                CAN {getSeparatedNumber(e.omnicommData[0].ccan?.spn245) || 0}
                &nbsp;км
              </span>
            </>
          )}
          {/* {e.details?.temp_can_mileage && (
            <>
              <Divider orientation="vertical" className="h-auto min-h-6" />
              <span className="text-sm text-center font-semibold">
                {e.details.temp_can_mileage}&nbsp;км
              </span>
            </>
          )} */}
        </div>
      </div>
      <div className="flex gap-2 text-xs">
        {e.details?.details.map((el) => (
          <>
            <div className="flex flex-col gap-1 items-center justify-center">
              <span>
                <DetailIcon name={el.name} />
              </span>
              <span>
                {getSeparatedNumber(
                  Number(el.mileage.next_mileage) !== 0
                    ? Number(el.mileage.next_mileage) -
                        Number(e.omnicommData && e.omnicommData[0].ccan?.spn245)
                    : 0
                )}
              </span>
            </div>
            <Divider orientation="vertical" className="h-auto min-h-3" />
          </>
        ))}
        {e.details?.accumulator.last_swap == null ? (
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
