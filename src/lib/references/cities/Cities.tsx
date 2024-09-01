"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "./api";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const Cities = (autocompleteProps: AutocompleteProps) => {
  const { isLoaded, isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getCities"],
    queryFn: getCities,
    enabled: !!isSignedIn,
  });

  if (isLoading || !data?.data) {
    return <Spinner />;
  }

  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите город" {...autocompleteProps}>
        {data?.data?.map((e, i) => (
          <AutocompleteItem key={e.name} value={e.name} textValue={`${e.name}`}>
            {e.name}
          </AutocompleteItem>
        )) || <Spinner />}
      </Autocomplete>
    </div>
  );
};
