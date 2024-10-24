"use client";

import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useCashierColumnsConfig } from "./Table.config";
import { CashboxType } from "../../types";
import { UTable } from "@/tool-kit/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getClients } from "../api";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase/client";

export const CashierTable = () => {
  const columns = useCashierColumnsConfig();
  const config: UseTableConfig<CashboxType> = {
    row: {
      setRowData(info) {},
      className: "",
    },
  };

  const [clients, setClients] = useState<CashboxType[]>([]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["get clients for cashbox"],
    mutationFn: async () => await getClients(),
    onSuccess: (data) => {
      setClients(data);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    const cn = supabase
      .channel(`cashbox-view`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cashbox",
        },
        (payload) => {
          const updatedClient = payload.new as CashboxType;

          if (payload.eventType == "INSERT")
            setClients((prev) => [...prev, updatedClient]);
          else
            setClients((prev) => {
              const updatedClients = prev.map((client) =>
                client.id === updatedClient.id ? updatedClient : client
              );
              return updatedClients;
            });
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  if (isPending) {
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
