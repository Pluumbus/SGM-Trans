"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "./api";
import { Autocomplete, AutocompleteItem, Spinner } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const Cities = () => {
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
      <Autocomplete label="Выберите город">
        {data?.data?.map((e, i) => (
          <AutocompleteItem key={i} value={e.name} textValue={`${e.name}`}>
            {e.name}
          </AutocompleteItem>
        )) || <Spinner />}
      </Autocomplete>
    </div>
  );
};
