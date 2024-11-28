"use client";

import { NextPage } from "next";
import {
  getAllVehiclesStatistics,
  getSingleVehicleStatistics,
  getVehiclesInfo,
  getVehiclesTree,
} from "./_api/requests";
import { useQuery } from "@tanstack/react-query";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { VehicleCard } from "./_features/CarCard";
import { ReportStatisticsType } from "./_api/types";

interface Props {}

const Page: NextPage<Props> = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get vehicles ls"],
    // queryFn: async () => await getVehiclesInfo(),
    queryFn: async () =>
      (await getAllVehiclesStatistics()) as ReportStatisticsType,
  });

  if (isLoading) {
    return <Spinner />;
  }
  console.log(data);
  return (
    <div className="grid grid-cols-4 gap-2">
      {data?.data.vehicleDataList.map((e) => <VehicleCard vehicle={e} />)}
      {/* {JSON.parse(JSON.stringify(data))} */}
    </div>
  );
};

export default Page;
