"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "./api";
import { Autocomplete, AutocompleteItem, Spinner } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const Drivers = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getDrivers"],
    queryFn: getDrivers,
    enabled: !!isSignedIn,
  });

  if (isLoading || !data?.data) {
    return (
      <div className="flex justify-center mt-60">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите водителя">
        {data?.data?.map((e, i) => (
          <AutocompleteItem
            key={i}
            value={e.cars.car}
            textValue={`${e.name} | ${e.cars.car} | ${e.cars.state_number}`}
          >
            {e.name} | {e.cars.car} | {e.cars.state_number}
          </AutocompleteItem>
        )) || <Spinner />}
      </Autocomplete>
    </div>
  );
};
