"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { useRole } from "@/components/roles/useRole";
import { getBaseColumnsConfig } from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/[id]/_features/_Table/CargoTable.config";

const excludeNeededItems = (
  base: UseTableColumnsSchema<CargoType>[],
  exclude: string[]
) => {
  return base.filter((e) => !exclude.includes(e.accessorKey));
};

const GlobalLogistSchema = () => {
  const excl = [""];
  return excludeNeededItems(getBaseColumnsConfig(), excl);
};
const GlobalWareHouseManagerSchema = () => {
  const excl = [
    "amount",
    "is_act_ready",
    "is_unpalletizing",
    "loading_scheme",
    "driver",
    "client_bin",
  ];
  return excludeNeededItems(getBaseColumnsConfig(), excl);
};
const CashierSchema = () => {
  const excl = [""];
  return excludeNeededItems(getBaseColumnsConfig(), excl);
};
export const useRoleBasedSchema = (): UseTableColumnsSchema<CargoType>[] => {
  const role = useRole();
  switch (role) {
    // case "Админ":
    //   return GlobalWareHouseManagerSchema();
    case "Логист":
      return GlobalLogistSchema();
    case "Зав.Склада":
      return GlobalWareHouseManagerSchema();
    case "Зав.Склада Москва":
      return GlobalWareHouseManagerSchema();
    case "Кассир":
      return CashierSchema();
    default:
      return getBaseColumnsConfig();
  }
};
