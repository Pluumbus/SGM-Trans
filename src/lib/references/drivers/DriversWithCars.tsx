"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDriversWithCars } from "./api";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const DriversWithCars = (autocompleteProps: AutocompleteProps) => {
  const { isLoaded, isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getDrivers"],
    queryFn: getDriversWithCars,
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
      <Autocomplete label="Выберите водителя" {...autocompleteProps}>
        {data?.data?.map((e, i) => (
          <AutocompleteItem
            key={i}
            value={e.cars.car}
            textValue={`${e.name} | ${e.cars?.car} | ${e.cars?.state_number}`}
          >
            {e.name} | {e.cars?.car} | {e.cars?.state_number}
          </AutocompleteItem>
        )) || <Spinner />}
      </Autocomplete>
    </div>
  );
};
