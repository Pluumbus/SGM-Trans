"use client";

import {
  CarDetailsType,
  CarsType,
  SingleDetailType,
} from "@/lib/references/drivers/feature/types";
import supabase from "@/utils/supabase/client";
import { DetailNameType } from "../_features/DisclosureContext";
import { CarsWithOmnicommType } from "../_features/CarCard/CarDetailsCard";

export const changeMileage = async (car: CarsType, mileage: string) => {
  const { details } = car;

  const updatedDetails: CarDetailsType = {
    ...details,
    temp_can_mileage: mileage,
  };

  const { data, error } = await (await supabase)
    .from("cars")
    .update({ details: updatedDetails })
    .eq("id", Number(car.id));

  if (error) {
    throw new Error();
  }
  return data;
};

export const swapAccumulators = async (car: CarsWithOmnicommType) => {
  const { details } = car.car;
  const updatedDetails: CarDetailsType = {
    ...details,
    accumulator: {
      accumulators: details.accumulator.accumulators.map((e) => ({
        ...e,
        location: e.location == "Верхний" ? "Нижний" : "Верхний",
      })),

      last_swap: new Date().toISOString(),
    },
  };
  const { data, error } = await supabase
    .from("cars")
    .update({ details: updatedDetails })
    .eq("id", Number(car.car.id));

  if (error) {
    throw new Error();
  }
  return data;
};

export const addDetailToCar = async ({
  car,
  newDetails,
}: {
  car: CarsType;
  newDetails: CarDetailsType;
}) => {
  const prevDetails = car?.details ? car.details : {};
  const details = {
    ...prevDetails,
    ...newDetails,
    created_at: new Date().toISOString(),
  };
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
  section,
}: {
  car: CarsType;
  updatedDetail: SingleDetailType;
  section: DetailNameType;
}) => {
  if (!car.details) {
    throw new Error("Car does not have existing details.");
  }

  const updatedCarDetails = { ...car.details };

  switch (section) {
    case "detail":
      updatedCarDetails.details = updatedCarDetails.details.map((detail) =>
        detail.name === updatedDetail.name ? updatedDetail : detail
      );
      break;

    case "accumulator":
      updatedCarDetails.accumulator = {
        ...updatedCarDetails.accumulator,
        accumulators: updatedCarDetails.accumulator.accumulators.map((acc) =>
          acc.location === updatedDetail.location ? updatedDetail : acc
        ),
      };
      break;

    case "wheel":
      updatedCarDetails.vehicle_axis = updatedCarDetails.vehicle_axis.map(
        (axis, i) => {
          if (i === updatedDetail.index) {
            return {
              ...axis,
              [updatedDetail.side]: {
                ...axis[updatedDetail.side],
                wheel: {
                  ...axis[updatedDetail.side].wheel,
                  ...updatedDetail,
                },
              },
            };
          }
          return axis;
        }
      );
      break;

    case "brake_shoe":
      updatedCarDetails.vehicle_axis = updatedCarDetails.vehicle_axis.map(
        (axis, i) => {
          if (i === updatedDetail.index) {
            return {
              ...axis,
              [updatedDetail.side]: {
                ...axis[updatedDetail.side],
                brake_shoe: {
                  ...axis[updatedDetail.side].brake_shoe,
                  ...updatedDetail,
                },
              },
            };
          }
          return axis;
        }
      );
      break;

    case "axis":
      updatedCarDetails.vehicle_axis = [
        ...updatedCarDetails.vehicle_axis,
        updatedDetail,
      ];
      break;
    case "deleteAxis":
      updatedCarDetails.vehicle_axis = updatedCarDetails.vehicle_axis.filter(
        (axis, index) => index !== updatedDetail.index
      );
      break;
    default:
      throw new Error("Unknown section specified for update.");
  }

  const { data, error } = await supabase
    .from("cars")
    .update({ details: updatedCarDetails })
    .eq("id", car.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
