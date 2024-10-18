import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { CashboxType } from "../../types";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { CiSettings } from "react-icons/ci";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useCashierActions } from "./useCashierActions";

export const useCashierColumnsConfig =
  (): UseTableColumnsSchema<CashboxType>[] => {
    const columnsConfig: UseTableColumnsSchema<CashboxType>[] = [
      {
        accessorKey: "client",
        header: "Клиент",
        filter: true,
        cell: (info: Cell<CashboxType, ReactNode>) => (
          <div className="font-semibold">{info.getValue().toString()}</div>
        ),
      },
      {
        accessorKey: "amount_to_pay",
        header: "Сумма которую должен клиент за все грузы",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => {
          return <div>{info.getValue() || ""}</div>;
        },
      },
      {
        accessorKey: "current_balance",
        header: "Текущий баланс клиента",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => (
          <div>{info.getValue()}</div>
        ),
      },

      {
        accessorKey: "rest_amount_needed_to_be_payed",
        header: "Остаток",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => (
          <div>
            {Number(info.row.original.amount_to_pay) -
              Number(info.row.original.current_balance)}
          </div>
        ),
      },

      {
        accessorKey: "cargos",
        header: "Рейсы в которых находятся грузы клиента",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => <div>грузы</div>,
      },
      {
        accessorKey: "payment_terms",
        header: "Срок оплаты по договору",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => (
          <div>{info.getValue()}</div>
        ),
      },
      {
        accessorKey: "action",
        header: "",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => {
          const actions = useCashierActions(info);
          return (
            <div>
              <div className="py-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      isIconOnly
                      className="max-w-[30px] max-h-[35px]"
                    >
                      <CiSettings size={20} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Dynamic Actions">
                    {actions.map((e) => (
                      <DropdownItem key={e.label} onClick={e.onClick}>
                        {e.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              {actions.map((e) => e.modal)}
            </div>
          );
        },
      },
    ];

    return columnsConfig;
  };
