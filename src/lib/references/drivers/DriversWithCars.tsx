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

export const DriversWithCars = (
  autocompleteProps: Omit<AutocompleteProps, "children">
) => {
  const { isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getDrivers"],
    queryFn: getDriversWithCars,
    enabled: !!isSignedIn,
  });

  return (
    <Autocomplete
      label="Выберите водителя"
      isLoading={isLoading || !data?.data}
      {...autocompleteProps}
    >
      {data &&
        data?.data?.map((e, i) => (
          <AutocompleteItem
            key={e.id}
            value={e.id}
            textValue={
              e.name != "Наемник"
                ? `${e.name} | ${e.cars?.car} | ${e.cars?.state_number}`
                : `${e.name}`
            }
          >
            {e.name != "Наемник"
              ? `${e.name} | ${e.cars?.car} | ${e.cars?.state_number}`
              : `${e.name}`}
          </AutocompleteItem>
        ))}
    </Autocomplete>
  );
};
