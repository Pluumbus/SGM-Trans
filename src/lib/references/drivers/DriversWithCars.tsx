"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDriversWithCars } from "./feature/api";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { DriversType } from "@/lib/references/drivers/feature/types";

export const DriversWithCars = (
  autocompleteProps: Omit<AutocompleteProps, "children">
) => {
  const { isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getDriversWithGazellCars"],
    queryFn: getDriversWithCars,
    enabled: !!isSignedIn,
  });

  const sortedData = data?.filter((driver) => driver.car_type === "gazell");
  return (
    <Autocomplete
      label="Выберите водителя"
      isLoading={isLoading || !sortedData}
      {...autocompleteProps}
    >
      {data &&
        sortedData.map((e, i) => (
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
