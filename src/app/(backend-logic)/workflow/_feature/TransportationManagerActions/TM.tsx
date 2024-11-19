import { Button, Spinner, Tooltip, useDisclosure } from "@nextui-org/react";
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

  return (
    <>
      <div
        className={`gap-2 col-span-2 grid grid-cols-6 ${type == "Table" ? "items-end" : "items-center"}`}
      >
        <div className="col-span-5">
          <ExistingClients
            state={state}
            onChange={onChange}
            props={{
              variant: type == "Table" ? "underlined" : "flat",
            }}
          />
        </div>
        <div className="flex flex-col gap-2 col-span-1">
          {type == "Table" &&
            (!isLoading ? (
              <Link
                href={`https://wa.me/${data[0]?.client?.phone_number.replace(/[\s-]/g, "")}`}
                target="_blank"
              >
                <Button isIconOnly color="success">
                  <FaWhatsapp size={20} />
                </Button>
              </Link>
            ) : (
              <Button isIconOnly isLoading>
                <FaWhatsapp size={20} />
              </Button>
            ))}
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
      </div>
      <TMModal disclosure={disclosure} state={state} />
    </>
  );
};

export const str = (e: CashboxType) =>
  `${e.client.full_name.last_name} ${e.client.full_name.first_name} ${e.client.phone_number}`;
