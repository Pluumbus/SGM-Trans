import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { TMModal } from "./TMModal";
import { ExistingClients } from "./ExistingClients";
import { CashboxType } from "../../cashbox/types";
import { FaPlus } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

export const TM = ({
  state,
  onChange,
  type = "Modal",
}: {
  state: [number, React.Dispatch<React.SetStateAction<number>>];
  onChange?: () => void;
  type?: "Modal" | "Table";
}) => {
  const disclosure = useDisclosure();

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
      <TMModal disclosure={disclosure} state={state} />
    </>
  );
};

export const str = (e: CashboxType) =>
  `${e.client.full_name.last_name} ${e.client.full_name.first_name} ${e.client.phone_number}`;
