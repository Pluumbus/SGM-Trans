"use client";

import React from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
} from "@nextui-org/react";
import { allCities } from "./citiesRef";

export const Cities = (
  autocompleteProps: Omit<AutocompleteProps, "children">
) => {
  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите город" {...autocompleteProps}>
        {allCities.map((name) => (
          <AutocompleteItem key={name} value={name} textValue={`${name}`}>
            {name}
          </AutocompleteItem>
        )) || <Spinner />}
      </Autocomplete>
    </div>
  );
};
