"use client";

import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useCashierColumnsConfig } from "./Table.config";
import { CashboxType } from "../../types";
import { UTable } from "@/tool-kit/ui";
import { useMutation } from "@tanstack/react-query";
import { getClients } from "../api";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase/client";
import { getSeparatedNumber } from "@/tool-kit/hooks";
import { TMModal } from "../../../_feature/TransportationManagerActions/TMModal";
import { FaPlus } from "react-icons/fa6";
import { useCashboxMode } from "../Context";
import { getSchema } from "@/utils/supabase/getSchema";
import { CashboxTableType } from "@/lib/types/cashbox.types";

export const CashierTable = () => {
  const columns = useCashierColumnsConfig();
  const config: UseTableConfig<CashboxTableType> = {
    row: {
      setRowData(info) {},
      setClassNameOnRow(info) {
        if (
          info.original?.cargos &&
          info.original?.cargos?.some(
            (e) =>
              e?.amount?.type == "Б/нал в МСК" || e?.amount?.type == "Нал в МСК"
          )
        ) {
          return "bg-primary-100";
        }
      },
      className: "",
    },
  };

  const [clients, setClients] = useState<CashboxTableType[]>([]);
  const [originalClients, setOriginalClients] = useState<CashboxTableType[]>(
    []
  );

  const { mode, setMode } = useCashboxMode();

  const { mutate, isPending } = useMutation({
    mutationKey: ["get clients for cashbox"],
    mutationFn: async () => await getClients(),
    onSuccess: (data) => {
      setClients(getClientsByMode(data, mode));
      setOriginalClients(data);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    if (clients && mode) {
      setClients(getClientsByMode(originalClients, mode));
    }
  }, [mode]);

  useEffect(() => {
    const cn = supabase
      .channel(`cashbox-view`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: getSchema(),
          table: "cashbox",
        },
        (payload) => {
          const updatedClient = payload.new as CashboxTableType;

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
      <div className="flex justify-center w-full items-center">
        <div className="flex flex-col gap-2">
          <Checkbox
            isDisabled={isPending}
            isSelected={mode == "MSK"}
            onValueChange={(e) => {
              setMode(e ? "MSK" : "none");
            }}
          >
            Показать только клиентов которые оплачивают в МСК
          </Checkbox>
          <Checkbox
            isDisabled={isPending}
            isSelected={mode == "KZ"}
            onValueChange={(e) => {
              setMode(e ? "KZ" : "none");
            }}
          >
            Показать только клиентов с Обраток
          </Checkbox>
          <Checkbox
            isDisabled={isPending}
            isSelected={mode == "Arrived"}
            onValueChange={(e) => {
              setMode(e ? "Arrived" : "none");
            }}
          >
            Показать только клиентов грузы которых уже прибыли
          </Checkbox>
        </div>
      </div>
      <CashoboxSummary data={clients} />
      <UTable
        props={{
          isCompact: false,
        }}
        tBodyProps={{
          isLoading: isPending,
        }}
        data={clients}
        isPagiantion={false}
        columns={columns}
        name={`Cashier Table`}
        config={config}
      />
    </div>
  );
};

const CashoboxSummary = ({ data }: { data: CashboxTableType[] }) => {
  const disclosure = useDisclosure();
  const { mode } = useCashboxMode();

  const state = useState<number>();
  const clients = getClientsByMode(data, mode);

  const debt = getDebt(clients);
  const paidSum = getPaidSum(clients);

  return (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span>Общий долг кассы:</span>
          <span className="font-semibold">{getSeparatedNumber(debt)} тг</span>
        </div>
        <div className="flex gap-2 items-center">
          <span>Оплачено на сумму:</span>
          <span className="font-semibold">
            {getSeparatedNumber(paidSum)} тг
          </span>
        </div>
      </div>

      <div>
        <Button
          color="success"
          variant="flat"
          onPress={() => {
            disclosure.onOpenChange();
          }}
        >
          <span>Добавить плательщика</span>
          <FaPlus />
        </Button>
      </div>
      <TMModal disclosure={disclosure} state={state} />
    </div>
  );
};

const getClientsByMode = (
  data: CashboxTableType[],
  mode: ReturnType<typeof useCashboxMode>["mode"]
) => {
  switch (mode) {
    case "KZ":
      return getKZClients(data);
    case "MSK":
      return getMSKClients(data);
    case "Arrived":
      return getArrivedClients(data);
    case "none":
      return data;
    default:
      return data;
  }
};

const getPaidSum = (data: CashboxTableType[]) =>
  data
    ?.flatMap((e) => e.cargos)
    ?.reduce((total, el) => total + Number(el?.paid_amount || 0), 0);

const getDebt = (data: CashboxTableType[]) =>
  data
    ?.flatMap((e) => e.cargos)
    ?.reduce(
      (total, el) =>
        total + (Number(el?.amount?.value || 0) - Number(el?.paid_amount || 0)),
      0
    );

const getMSKClients = (data: CashboxTableType[]) => {
  const filteredClients = data
    .filter(
      (e) =>
        Array.isArray(e.cargos) &&
        e.cargos.some(
          (el) =>
            el.amount?.type === "Нал в МСК" || el.amount?.type === "Б/нал в МСК"
        )
    )
    .map((e) => ({
      ...e,
      cargos: e.cargos.filter(
        (el) =>
          el.amount?.type === "Нал в МСК" || el.amount?.type === "Б/нал в МСК"
      ),
    }));

  return filteredClients;
};

const getKZClients = (data: CashboxTableType[]) => {
  const filteredClients = data
    .filter(
      (e) =>
        Array.isArray(e.cargos) && e.cargos.some((el) => el.week_type == "kz")
    )
    .map((e) => ({
      ...e,
      cargos: e.cargos.filter((el) => el.week_type == "kz"),
    }));

  return filteredClients;
};

const getArrivedClients = (data: CashboxTableType[]) => {
  const filteredClients = data
    .filter(
      (e) =>
        Array.isArray(e.cargos) &&
        e.cargos.some((el) => el.trip_status === "Прибыл")
    )
    .map((e) => ({
      ...e,
      cargos: e.cargos.filter((el) => el.trip_status === "Прибыл"),
    }));

  return filteredClients;
};
