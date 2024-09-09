"use client";

import React from "react";
import { Autocomplete, AutocompleteItem, Spinner } from "@nextui-org/react";
import { citiesKz } from "./citiesDictionary";

export const CitiesKZ = () => {
  return (
    <div className="max-w-80">
      <Autocomplete label="Выберите город">
        {citiesKz.map((name) => (
          <AutocompleteItem key={"kz"} value={name} textValue={`${name}`}>
            {name}
          </AutocompleteItem>
        )) || <Spinner />}
      </Autocomplete>
    </div>
  );
};
