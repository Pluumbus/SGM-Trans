"use client";

import React from "react";
import { Autocomplete, AutocompleteItem, Spinner } from "@nextui-org/react";
import { citiesRu } from "./citiesDictionary";

export const CitiesRU = () => {
  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите город">
        {citiesRu.map((name) => (
          <AutocompleteItem key={"ru"} value={name} textValue={`${name}`}>
            {name}
          </AutocompleteItem>
        )) || <Spinner />}
      </Autocomplete>
    </div>
  );
};
