import { CargoType } from "../../types";
import { GetCitiesFromTheWeekType } from "../api";

function isGetCitiesFromTheWeekType(
  data: GetCitiesFromTheWeekType | CargoType[]
): data is GetCitiesFromTheWeekType {
  if (!Array.isArray(data) || data.length === 0) return false;
  return "cargos" in data[0];
}

export const groupCargosByCity = (
  data: GetCitiesFromTheWeekType | CargoType[]
) => {
  const cityMap: Record<string, CargoType[]> = {};

  if (isGetCitiesFromTheWeekType(data)) {
    data?.map((item) => {
      item.cargos.forEach((cargo) => {
        const city = cargo?.unloading_point?.city || "";
        if (!cityMap[city]) {
          cityMap[city] = [];
        }
        cityMap[city].push(cargo);
      });
    });
  } else {
    data?.map((cargo) => {
      const city = cargo?.unloading_point?.city || "";
      if (!cityMap[city]) {
        cityMap[city] = [];
      }
      cityMap[city].push(cargo);
    });
  }

  const result = Object.keys(cityMap).map((city) => ({
    city,
    cargos: cityMap[city],
  }));

  return result;
};
