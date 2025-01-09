"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { useRole } from "@/components/RoleManagment/useRole";
import { getBaseColumnsConfig } from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/[id]/_features/_Table/CargoTable.config";

const excludeNeededItems = (
  base: UseTableColumnsSchema<CargoType>[],
  exclude: string[],
  isWH?: boolean
) => {
  const exc = isWH ? ["action", ...exclude] : exclude;
  return base.filter((e) => !exc.includes(e.accessorKey));
};

const GlobalLogistSchema = () => {
  const excl = [""];
  return excludeNeededItems(getBaseColumnsConfig(), excl, true);
};
const MngSchema = () => {
  const excl = [""];
  return excludeNeededItems(getBaseColumnsConfig(), excl, true);
};
export const WHSchema = () => {
  const excl = [
    "amount",
    "is_act_ready",
    "receipt_address",
    "is_unpalletizing",
    "loading_scheme",
    "driver",
    "CheckBox",
    "transportation_manager",
    "status",
    "act_details",
    "client_bin",
  ];
  return excludeNeededItems(getBaseColumnsConfig(), excl, false);
};
const GlobalWareHouseManagerSchema = () => {
  const excl = [
    "amount",
    "is_act_ready",
    "is_unpalletizing",
    "loading_scheme",
    "driver",
    "transportation_manager",
  ];
  return excludeNeededItems(getBaseColumnsConfig(), excl, true);
};
const CashierSchema = () => {
  const excl = [""];
  return excludeNeededItems(getBaseColumnsConfig(), excl, true);
};
export const useRoleBasedSchema = (): UseTableColumnsSchema<CargoType>[] => {
  const role = useRole();
  switch (role) {
    // case "Админ":
    //   return CashierSchema();
    //   return GlobalWareHouseManagerSchema();

    case "Логист":
      return GlobalLogistSchema();
    case "Зав.Склада":
      return GlobalWareHouseManagerSchema();
    case "Зав.Склада Москва":
      return GlobalWareHouseManagerSchema();
    case "Кассир":
      return CashierSchema();
    case "Менеджер":
      return MngSchema();
    default:
      return excludeNeededItems(getBaseColumnsConfig(), [""], true);
  }
};
