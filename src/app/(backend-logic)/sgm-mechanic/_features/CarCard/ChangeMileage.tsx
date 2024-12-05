"use client";

import { CarsType } from "@/lib/references/drivers/feature/types";
import { Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { changeMileage } from "../../_api/supa.requests";
import { useDebounce } from "@/tool-kit/hooks";

export const ChangeMileage = ({ car }: { car: CarsType }) => {
  const [mileage, setMileage] = useState<string>(
    car.details.temp_can_mileage || ""
  );

  const debounce = useDebounce();
  const { mutate } = useMutation({
    mutationFn: async ({ car, value }: { car: CarsType; value: string }) =>
      changeMileage(car, value),
  });

  const onChange = (value: string) => {
    setMileage(value);
    debounce(() => {
      mutate({ car, value });
    }, 500);
  };

  return (
    <div className="mb-8">
      <Input
        autoFocus
        variant="underlined"
        label={<span className="text-lg">Укажите пробег</span>}
        value={mileage}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        endContent={<span className="font-semibold text-lg">км</span>}
      />
    </div>
  );
};
