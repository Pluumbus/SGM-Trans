"use client";

import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useCashierColumnsConfig } from "./Table.config";
import { CashboxType } from "../../types";
import { UTable } from "@/tool-kit/ui";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "../api";
import { Spinner } from "@nextui-org/react";

export const CashierTable = () => {
  const columns = useCashierColumnsConfig();
  const config: UseTableConfig<CashboxType> = {
    row: {
      setRowData(info) {},
      className: "",
    },
  };

  const { data: clients, isLoading } = useQuery({
    queryKey: ["get clients for cashbox"],
    queryFn: async () => await getClients(),
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <UTable
      props={{
        isCompact: false,
      }}
      data={clients}
      isPagiantion={false}
      columns={columns}
      name={`Cashier Table`}
      config={config}
    />
  );
};
