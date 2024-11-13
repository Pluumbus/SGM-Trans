"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCars,
  getDrivers,
  getDriversWithCars,
  getTrailers,
} from "./feature/api";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const Trailers = (props: Omit<AutocompleteProps, "children">) => {
  const { isLoaded, isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getTrailers"],
    queryFn: getTrailers,
    enabled: !!isSignedIn,
  });

  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите прицеп" {...props} isLoading={isLoading}>
        {data?.map((e, i) => (
          <AutocompleteItem
            key={`${e.trailer + " - " + e.state_number}`}
            value={`${e.trailer + " - " + e.state_number}`}
            textValue={`${e.trailer + " - " + e.state_number}`}
          >
            {`${e.trailer + " - " + e.state_number}`}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
