import { useDisclosure } from "@nextui-org/react";
import { ChangeClientBalance } from "./Modals";
import { Cell } from "@tanstack/react-table";
import { CashboxType } from "../../types";
import { ReactNode } from "react";
import { AddPaymentToCargo } from "./Modals/AddPaymentToCargo";

export const useCashierActions = (info: Cell<CashboxType, ReactNode>) => {
  const cahngeClientBalance = useDisclosure();
  const addPaymentTocargo = useDisclosure();
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
    {
      label: "Добавить оплату за груз",
      onClick: () => {
        addPaymentTocargo.onOpenChange();
      },
      modal: <AddPaymentToCargo disclosure={addPaymentTocargo} info={info} />,
    },
  ];

  return ACTIONS;
};
