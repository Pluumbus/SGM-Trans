"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDrivers, getDriversWithCars } from "./api";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const Drivers = (props: Omit<AutocompleteProps, "children">) => {
  const { isLoaded, isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getDriversWithCars"],
    queryFn: getDriversWithCars,
    enabled: !!isSignedIn,
  });

  const sortedData = data?.filter((e) => e.car_type === "truck");
  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите водителя" {...props} isLoading={isLoading}>
        {sortedData?.map((e, i) => (
          <AutocompleteItem
            key={`${e.name} | ${e.cars?.car}`}
            value={`${e.name} | ${e.cars?.car}`}
            textValue={`${e.name} | ${e.cars?.car}`}
          >
            {`${e.name} | ${e.cars?.car}`}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
