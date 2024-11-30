"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCars, getDrivers, getDriversWithCars } from "./feature/api";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const Cars = (props: Omit<AutocompleteProps, "children">) => {
  const { isLoaded, isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getCars"],
    queryFn: async () => await getCars(),
    enabled: !!isSignedIn,
  });

  const sortedData = data?.filter((e) => e.car_type === "truck");
  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите машину" {...props} isLoading={isLoading}>
        {sortedData?.map((e, i) => (
          <AutocompleteItem
            key={`${e.car + " - " + e.state_number}`}
            value={`${e.car + " - " + e.state_number}`}
            textValue={`${e.car + " - " + e.state_number}`}
          >
            {`${e.car + " - " + e.state_number}`}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
