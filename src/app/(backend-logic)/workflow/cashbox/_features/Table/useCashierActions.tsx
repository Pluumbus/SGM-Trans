import { useDisclosure } from "@nextui-org/react";
import { ChangeClientBalance } from "./Modals";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { AddPaymentToCargo } from "./Modals/AddPaymentToCargo";
import { ChangePaymentTerms } from "./Modals/ChangePaymentTerms";
import { CashboxTableType } from "@/lib/types/cashbox.types";

export const useCashierActions = (info: Cell<CashboxTableType, ReactNode>) => {
  const cahngeClientBalance = useDisclosure();
  const addPaymentTocargo = useDisclosure();
  const changePaymentTerms = useDisclosure();
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
    {
      label: "Изменить допустимую задержку оплаты",
      onClick: () => {
        changePaymentTerms.onOpenChange();
      },
      modal: <ChangePaymentTerms info={info} disclosure={changePaymentTerms} />,
    },
  ];

  return ACTIONS;
};
