import { useDisclosure } from "@nextui-org/react";
import { ChangeClientBalance } from "./Modals";
import { Cell } from "@tanstack/react-table";
import { CashboxType } from "../../types";
import { ReactNode } from "react";

export const useCashierActions = (info: Cell<CashboxType, ReactNode>) => {
  const cahngeClientBalance = useDisclosure();
  const ACTIONS = [
    {
      label: "Добавить баланс клиенту",
      onClick: () => {
        cahngeClientBalance.onOpenChange();
      },
      modal: (
        <ChangeClientBalance disclosure={cahngeClientBalance} info={info} />
      ),
    },
  ];

  return ACTIONS;
};
