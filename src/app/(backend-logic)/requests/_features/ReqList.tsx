"use client";

import { useQuery } from "@tanstack/react-query";
import { getRequests } from "../_api";
import { Spinner } from "@nextui-org/react";
import { ReqCard } from "./ReqCard";

export const ReqList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetRequestsForLogist"],
    queryFn: async () => await getRequests(),
  });
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="grid grid-cols-1 gap-4 w-1/2">
      {data.map((e) => (
        <ReqCard info={e} />
      ))}
    </div>
  );
};
