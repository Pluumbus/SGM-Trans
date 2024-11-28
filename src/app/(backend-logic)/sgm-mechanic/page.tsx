"use client";

import { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/react";
import { getCars } from "@/lib/references/drivers/feature/api";
import { CarCard } from "./_features/CarCard";
import { getAllVehiclesStatistics } from "./_api/requests";
import { VehicleReportStatisticsType } from "./_api/types";

interface Props {}

const Page: NextPage<Props> = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get cars ls"],
    queryFn: async () => await getCars("truck"),
  });

  const { data: omnicommCars, isLoading: isLoadingOmicomm } = useQuery({
    queryKey: ["get omnicomm cars"],
    queryFn: async () =>
      await getAllVehiclesStatistics().then(
        (data) => data.data.vehicleDataList
      ),
  });

  if (isLoading || isLoadingOmicomm) {
    return <Spinner />;
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {data?.map((e) => (
          <CarCard
            car={{
              ...e,
              omnicommData: omnicommCars.find(
                (el) =>
                  el.name !== "D" && el.vehicleID.toString() == e.omnicomm_uuid
              ) as VehicleReportStatisticsType,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Page;
