"use client";

import { NextPage } from "next";
import {
  getVehicleCurrentState,
  getVehicleReport,
  getVehiclesInfo,
} from "./_api/requests";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/react";

interface Props {}

const Page: NextPage<Props> = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get vehicles ls"],
    queryFn: async () => await getVehiclesInfo(),
  });

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
