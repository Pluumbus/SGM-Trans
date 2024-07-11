"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDriversWithCarsWithTrailers } from "./api";
import { Autocomplete, AutocompleteItem, Spinner } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export const DriversWithCarsWithTrailers = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["getDriversWithCarsWithTrailers"],
    queryFn: getDriversWithCarsWithTrailers,
    enabled: !!isSignedIn,
  });

  if (isLoading || !data?.data) {
    return <Spinner />;
  }

  return (
    <div className="max-w-80">
      <Autocomplete
        label="Выберите водителя"
        isLoading={isLoading || !data?.data}
      >
        {data?.data?.map((e, i) => (
          <AutocompleteItem
            key={i}
            value={e.cars.car}
            textValue={`${e.name} | ${e.cars.car} | ${e.cars.state_number}`}
          >
            {e.name} | {e.cars.car} | {e.cars.state_number}
          </AutocompleteItem>
        )) || <Spinner />}
      </Autocomplete>
    </div>
  );
};
