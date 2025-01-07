"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDriversWithCars } from "./feature/api";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const DriversWithCars = (
  autocompleteProps: Omit<AutocompleteProps, "children">
) => {
  const { isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getDriversWithGazellCars"],
    queryFn: getDriversWithCars,
    enabled: !!isSignedIn,
  });

  return (
    <div>
      <Autocomplete
        label="Выберите водителя"
        isLoading={isLoading || !data}
        {...autocompleteProps}
      >
        {data &&
          data.map((e, i) => (
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
    </div>
  );
};
