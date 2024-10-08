"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "./api";
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
    queryKey: ["getDrivers"],
    queryFn: getDrivers,
    enabled: !!isSignedIn,
  });

  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите водителя" {...props} isLoading={isLoading}>
        {data?.data?.map((e, i) => (
          <AutocompleteItem key={e.name} value={e.name} textValue={`${e.name}`}>
            {e.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
