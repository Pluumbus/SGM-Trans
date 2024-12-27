import {
  Button,
  Input,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { TMModal } from "./TMModal";
import { ExistingClients } from "./ExistingClients";
import { CashboxType } from "../../cashbox/types";
import { FaPlus } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { Cell } from "@tanstack/react-table";
import { CargoType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getClient } from "../../cashbox/_features/api";
import { WhatsAppButton } from "@/components";

export const TM = ({
  state,
  onChange,
  type = "Modal",
  info,
}: {
  state: [number, React.Dispatch<React.SetStateAction<number>>];
  onChange?: () => void;
  type?: "Modal" | "Table";
  info?: Cell<CargoType, React.ReactNode>;
}) => {
  const disclosure = useDisclosure();

  const { data, isLoading } = useQuery({
    queryKey: [`manager info`, state[0]],
    queryFn: async ({ queryKey }) => await getClient(Number(queryKey[1])),
  });
  const newData = data || [];
  return (
    <>
      <div
        className={`gap-2 col-span-2 grid grid-cols-6 ${type == "Table" ? "items-end" : "items-center"}`}
      >
        {type == "Table" ? (
          <div className="flex flex-col w-[15rem]">
            {/* <Input
              isReadOnly
              variant="underlined"
              className="w-full"
              value={
                data[0].client.full_name.first_name +
                " " +
                data[0].client.company_name +
                " " +
                (data[0].client.phone_number || "")
              }
            /> */}
            <Input
              isReadOnly
              variant="underlined"
              className="w-full"
              value={newData[0]?.client?.full_name?.first_name || "Без имени"}
            />
            <Input
              isReadOnly
              variant="underlined"
              className="w-full"
              value={newData[0]?.client?.company_name || "Без компании"}
            />
            <div className="flex">
              <Input
                isReadOnly
                variant="underlined"
                className="w-full"
                value={newData[0]?.client?.phone_number || "Без номера"}
              />
              {!isLoading ? (
                <Link
                  href={
                    data
                      ? `https://wa.me/${data[0]?.client?.phone_number.replace(/[\s-]/g, "")}`
                      : ""
                  }
                  target="_blank"
                >
                  <Button isIconOnly color="success" variant="light">
                    <FaWhatsapp size={20} />
                  </Button>
                </Link>
              ) : (
                <Button isIconOnly isLoading variant="flat">
                  <FaWhatsapp size={20} />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="col-span-5">
              <ExistingClients
                state={state}
                onChange={onChange}
                props={{
                  variant: "flat",
                }}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1">
              <Tooltip content="Добавить Клиента">
                <Button
                  variant="ghost"
                  onClick={() => {
                    disclosure.onOpenChange();
                  }}
                  isIconOnly
                >
                  <FaPlus />
                </Button>
              </Tooltip>
            </div>
          </>
        )}
      </div>
      <TMModal disclosure={disclosure} state={state} />
    </>
  );
};

export const str = (e: CashboxType) =>
  `${e.client.full_name.last_name} ${e.client.full_name.first_name} ${e.client.phone_number}`;
