import {
  AutocompleteProps,
  Button,
  Divider,
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
import { cx } from "class-variance-authority";

export const TM = ({
  state,
  onChange,
  type = "Modal",
  autocompleteProps,
  info,
}: {
  state: [number, React.Dispatch<React.SetStateAction<number>>];
  onChange?: () => void;
  type?: "Modal" | "Table" | "Update Cargo Modal";
  autocompleteProps?: Omit<AutocompleteProps, "children">;
  info?: Cell<CargoType, React.ReactNode>;
}) => {
  const disclosure = useDisclosure();

  const { data, isLoading } = useQuery({
    queryKey: [`manager info`, state[0]],
    queryFn: async ({ queryKey }) => await getClient(Number(queryKey[1])),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const Clients = () => {
    switch (type) {
      case "Update Cargo Modal":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-end">
              <ExistingClients
                state={state}
                onChange={onChange}
                props={{
                  variant: "flat",
                  isClearable: false,
                  ...autocompleteProps,
                }}
              />

              <div className="flex flex-col gap-2 col-span-1">
                <Tooltip content="Добавить Клиента">
                  <Button
                    variant="ghost"
                    isDisabled={autocompleteProps.isDisabled}
                    onPress={() => {
                      disclosure.onOpenChange();
                    }}
                    isIconOnly
                  >
                    <FaPlus />
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <Input
                  label="Имя"
                  variant="underlined"
                  value={data?.client.full_name.first_name || ""}
                  isReadOnly
                />
                <Input
                  label="Компания"
                  variant="underlined"
                  value={data?.client.comment || ""}
                  isReadOnly
                />
              </div>
              <div className="flex gap-2 items-end">
                <Input
                  label="Номер телефона"
                  variant="underlined"
                  value={data?.client.phone_number || ""}
                  isReadOnly
                />
                <Link
                  href={
                    data
                      ? `https://wa.me/${data[0]?.client?.phone_number.replace(/[\s-]/g, "")}`
                      : ""
                  }
                  target="_blank"
                >
                  <Button isIconOnly color="success" variant="flat">
                    <FaWhatsapp size={20} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );

      case "Table":
        return (
          <div className="flex flex-col w-full col-span-6 justify-end">
            <span className="w-full">
              {data?.client?.full_name?.first_name || "Без имени"}
            </span>
            <span className="w-full">
              {data?.client?.company_name || "Без компании"}
            </span>
            <Divider className="mt-2" />
            <div className="flex w-full items-center">
              <span className="w-3/4">
                {data?.client?.phone_number || "Без номера"}
              </span>
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
        );
      default:
        return (
          <>
            <div className="col-span-5">
              <ExistingClients
                state={state}
                onChange={onChange}
                props={{
                  variant: "flat",
                  ...autocompleteProps,
                }}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1">
              <Tooltip content="Добавить Клиента">
                <Button
                  variant="ghost"
                  onPress={() => {
                    disclosure.onOpenChange();
                  }}
                  isIconOnly
                >
                  <FaPlus />
                </Button>
              </Tooltip>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div
        className={cx(
          type == "Update Cargo Modal"
            ? "col-span-2 w-full"
            : `gap-2 col-span-2 grid grid-cols-6 ${type == "Table" ? "items-end" : "items-center"}`
        )}
      >
        <Clients />
      </div>
      <TMModal disclosure={disclosure} state={state} />
    </>
  );
};

export const str = (e: CashboxType) =>
  `${e.client.full_name.last_name} ${e.client.full_name.first_name} ${e.client.phone_number}`;
