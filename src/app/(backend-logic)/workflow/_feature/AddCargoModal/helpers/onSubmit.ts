import { UseMutateFunction } from "@tanstack/react-query";
import { CargoType } from "../../types";

export const addCargoOnSubmit = (
  data: CargoType,
  mutate: UseMutateFunction<void, Error, CargoType, unknown>,
  trip_id: number
) => {
  console.log("trip_id", trip_id);

  const unlPoint = data.unloading_point?.city
    ? data.unloading_point
    : {
        city: "",
        withDelivery: false,
        deliveryAddress: "",
      };
  mutate({
    ...data,
    trip_id: Number(trip_id),
    transportation_manager: Number(data.transportation_manager),
    client_bin: {
      snts: ["KZ-SNT-"],
      tempText: data.client_bin.tempText || "",
      xin: data.client_bin.xin || "",
    },
    unloading_point: unlPoint,
    // @ts-ignore
    status: data.status?.year
      ? // @ts-ignore
        `${data.status.year}-${data.status.month}-${data.status.day}`
      : `${new Date().toISOString().split("T")[0]}`,
  });
};
