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

interface Props {}

const Page: NextPage<Props> = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get vehicles ls"],
    // queryFn: async () => await getVehiclesInfo(),
    queryFn: async () => await getAllVehiclesStatistics(),
  });

  if (isLoading) {
    return <Spinner />;
  }
  console.log(data);
  return (
    <div className="grid grid-cols-4 gap-2">
      {/* {data?.map((e) => <VehicleCard vehicle={e} />)} */}
      {/* {JSON.parse(JSON.stringify(data))} */}
    </div>
  );
};

export default Page;
