"use client";

import {
  CarDetailType,
  CarsType,
} from "@/lib/references/drivers/feature/types";
import supabase from "@/utils/supabase/client";

export const addDetailToCar = async ({
  car,
  newDetails,
}: {
  car: CarsType;
  newDetails: CarDetailType;
}) => {
  const prevDetails = car?.details ? car.details : [];
  const details = [
    ...prevDetails,
    { ...newDetails, created_at: new Date().toISOString() },
  ];

  const { data, error } = await supabase
    .from("cars")
    .update({ details })
    .eq("id", Number(car.id));

  if (error) {
    throw new Error();
  }
  return data;
};

export const updateDetailToCar = async ({
  car,
  updatedDetail,
}: {
  car: CarsType;
  updatedDetail: CarDetailType;
}) => {
  if (!car?.details) {
    throw new Error("Car does not have existing details.");
  }

  const updatedDetails = car.details.map((detail) =>
    detail.created_at === updatedDetail.created_at
      ? { ...detail, ...updatedDetail, created_at: new Date().toISOString() }
      : detail
  );

  const { data, error } = await supabase
    .from("cars")
    .update({ details: updatedDetails })
    .eq("id", Number(car.id));

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
