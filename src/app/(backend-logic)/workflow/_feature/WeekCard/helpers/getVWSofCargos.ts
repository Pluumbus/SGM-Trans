import { CargoType } from "../../types";
import { groupCargosByCity } from "./groupCargosByCities";

type GroupedByCity = ReturnType<typeof groupCargosByCity>;

export type GroupedResultType = {
  city: string;
  totalVolume: number;
  totalWeight: number;
  totalAmount: number;
};

function isGroupedData(data: unknown): data is GroupedByCity {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof (data[0] as any)?.city === "string" &&
    Array.isArray((data[0] as any)?.cargos)
  );
}

export const getVWSofCargos = (
  data: GroupedByCity | CargoType[]
):
  | GroupedResultType[]
  | { totalVolume: number; totalWeight: number; totalAmount: number } => {
  if (isGroupedData(data)) {
    return data.map(({ city, cargos }) => {
      let totalVolume = 0;
      let totalWeight = 0;
      let totalAmount = 0;

      cargos.forEach((cargo) => {
        const volumeNum =
          parseFloat(String(cargo.volume).replace(",", ".")) || 0;
        const weightNum =
          parseFloat(String(cargo.weight).replace(",", ".")) || 0;
        const amountNum =
          parseFloat(String(cargo.amount?.value).replace(",", ".")) || 0;

        totalVolume += isNaN(volumeNum) ? 0 : volumeNum;
        totalWeight += isNaN(weightNum) ? 0 : weightNum;
        totalAmount += isNaN(amountNum) ? 0 : amountNum;
      });

      return {
        city,
        totalVolume,
        totalWeight,
        totalAmount,
      };
    });
  }

  let totalVolume = 0;
  let totalWeight = 0;
  let totalAmount = 0;

  data.map((cargo) => {
    const volumeNum = parseFloat(String(cargo.volume).replace(",", ".")) || 0;
    const weightNum = parseFloat(String(cargo.weight).replace(",", ".")) || 0;
    const amountNum =
      parseFloat(String(cargo.amount?.value).replace(",", ".")) || 0;

    totalVolume += isNaN(volumeNum) ? 0 : volumeNum;
    totalWeight += isNaN(weightNum) ? 0 : weightNum;
    totalAmount += isNaN(amountNum) ? 0 : amountNum;
  });

  return {
    totalVolume,
    totalWeight,
    totalAmount,
  };
};
