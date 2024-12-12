"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDrivers, getDriversWithCars } from "./feature/api";
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
    queryKey: ["GetDrivers"],
    queryFn: getDrivers,
    enabled: !!isSignedIn,
  });

  const sortedData = data?.filter((e) => e.car_type === "truck");
  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите водителя" {...props} isLoading={isLoading}>
        {sortedData?.map((e, i) => (
          <AutocompleteItem
            key={`${e.name}`}
            value={`${e.name}`}
            textValue={`${e.name}`}
          >
            {`${e.name}`}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
