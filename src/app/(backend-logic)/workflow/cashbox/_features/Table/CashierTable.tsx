"use client";

import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useCashierColumnsConfig } from "./Table.config";
import { CashboxType } from "../../types";
import { UTable } from "@/tool-kit/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getClients } from "../api";
import { Card, CardBody, Checkbox, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase/client";
import { getSeparatedNumber } from "@/tool-kit/hooks";

export const CashierTable = () => {
  const columns = useCashierColumnsConfig();
  const config: UseTableConfig<CashboxType> = {
    row: {
      setRowData(info) {},
      setClassNameOnRow(info) {
        if (
          info.original?.cargos &&
          info.original?.cargos?.some(
            (e) =>
              e?.amount?.type == "Б/нал в МСК" ||
              e?.amount?.type == "Нал в МСК",
          )
        ) {
          return "bg-primary-100";
        }
      },
      className: "",
    },
  };

  const [clients, setClients] = useState<CashboxType[]>([]);

  const [mskClientsOnly, setMskClientsOnly] = useState<CashboxType[]>([]);

  const [isMSKOnly, setIsMSKOnly] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["get clients for cashbox"],
    mutationFn: async () => await getClients(),
    onSuccess: (data) => {
      setClients(data);
      setMskClientsOnly(getMSKClients(data));
    },
  });

  const getClientsFortable = () => (isMSKOnly ? mskClientsOnly : clients);

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
                client.id === updatedClient.id ? updatedClient : client,
              );
              return updatedClients;
            });
        },
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
    <div>
      <Card shadow="none" className="w-2/12">
        <CardBody>
          <div className="flex gap-2 items-start">
            <div className="bg-primary-200 min-w-5 min-h-5 border"></div>
            <span className="text-sm">
              - Этим цветом показаны грузы которые оплачены или будут оплачены в
              МСК
            </span>
          </div>
        </CardBody>
      </Card>
      <div className="flex justify-center w-full">
        <Checkbox
          isSelected={isMSKOnly}
          onValueChange={(e) => {
            setIsMSKOnly(e);
          }}
        >
          Показать только клиентов которые оплачивают в МСК
        </Checkbox>
      </div>
      <CashoboxSummary data={clients} />
      <UTable
        props={{
          isCompact: false,
        }}
        data={getClientsFortable()}
        isPagiantion={false}
        columns={columns}
        name={`Cashier Table`}
        config={config}
      />
    </div>
  );
};

const CashoboxSummary = ({ data }: { data: CashboxType[] }) => {
  const sum = data
    ?.flatMap((e) => e.cargos)
    ?.reduce((total, el) => total + Number(el?.amount?.value || 0), 0);

  return (
    <div className="flex gap-2">
      <span>Общая сумма кассы:</span>
      <span className="font-semibold">{getSeparatedNumber(sum)} тг</span>
    </div>
  );
};

const getMSKClients = (data: CashboxType[]) =>
  data.filter(
    (e) =>
      Array.isArray(e.cargos) &&
      e.cargos.some(
        (el) =>
          el.amount?.type === "Нал в МСК" || el.amount?.type === "Б/нал в МСК",
      ),
  );
