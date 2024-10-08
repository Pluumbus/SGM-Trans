import { CargoType } from "@/app/workflow/_feature/types";
import { getBaseColumnsConfig } from "../_Table/CargoTable.config";
import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { useRole } from "@/components/roles/useRole";

const excludeNeededItems = (
  base: UseTableColumnsSchema<CargoType>[],
  exclude: string[]
) => {
  return base.filter((e) => !exclude.includes(e.accessorKey));
};

const DystantLogistSchema = () => {
  const excl = ["comments"];
  return excludeNeededItems(getBaseColumnsConfig(), excl);
};

export const useRoleBasedSchema = () => {
  const role = useRole();

  switch (role) {
    case "":
      break;

    default:
      break;
  }
};
