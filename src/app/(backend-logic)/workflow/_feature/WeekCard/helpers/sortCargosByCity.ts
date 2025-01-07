import { GetCitiesFromTheWeekType } from "../api";

export const sortDataByCity = (data: GetCitiesFromTheWeekType) => {
  return data?.map((item) => {
    const sortedCargos = [...item.cargos].sort((a, b) => {
      const cityA = a?.unloading_point?.city?.toLowerCase() ?? "";
      const cityB = b?.unloading_point?.city?.toLowerCase() ?? "";
      return cityA.localeCompare(cityB);
    });
    return {
      ...item,
      cargos: sortedCargos,
    };
  });
};
