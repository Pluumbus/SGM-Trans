import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";

import { Cell } from "@tanstack/react-table";

import { useToast } from "@/components/ui/use-toast";

import {
  addOperations,
  changeClientBalance,
  changeExactAmountPaidToCargo,
} from "../../api";
import {
  useNumberState,
  getSeparatedNumber,
  useConfirmContext,
} from "@/tool-kit/hooks";
import { useUser } from "@clerk/nextjs";
import { CashboxDTOType, CashboxTableType } from "@/lib/types/cashbox.types";

type AddPaymentToCargoArgs = {
  disclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
  cargo?: CashboxDTOType["cargos"][number];
  info: Cell<CashboxTableType, ReactNode>;
};

export const AddPaymentToCargo = ({
  disclosure,
  info,
  cargo,
}: AddPaymentToCargoArgs) => {
  const cargoInfo = info.row.original.cargos;
  const [formState, setFormState] = useState<null | number>(cargo?.id || null);
  const [isUsingBalance, setIsUsingBalance] = useState<boolean>(false);
  const { toast } = useToast();

  const formattedBalance = useNumberState({
    separator: ",",
  });

  const calculateNewDuty = (
    currentCargo: CashboxTableType["cargos"][number]
  ) => {
    const o = info.row.original;
    const balance = isUsingBalance ? Number(o.current_balance) : 0;

    const newCurrBalanceGreaterThanZero = [
      isUsingBalance ? 0 : Number(o.current_balance), // текущий баланс
      balance + currentCargo.paid_amount + formattedBalance.rawValue, // сколько оплачено за груз
    ];

    const newCurrBalanceLessThanZero = [
      Number(o.current_balance) +
        currentCargo.paid_amount +
        formattedBalance.rawValue -
        Number(currentCargo.amount.value), // текущий баланс

      currentCargo.amount.value, // сколько оплачено за груз
    ];

    const newCurrBalanceEqualZero = [
      Number(o.current_balance) + formattedBalance.rawValue,
      currentCargo.amount.value,
    ];
    const newCurrBalanceFullSinglePayment = [
      Number(o.current_balance),
      currentCargo.amount.value,
    ];
    const comparison =
      Number(currentCargo.amount.value) -
      (currentCargo.paid_amount + formattedBalance.rawValue + balance);

    if (
      (Number(currentCargo.amount.value) - formattedBalance.rawValue === 0 &&
        currentCargo.paid_amount === 0) ||
      Number(currentCargo.amount.value) -
        (formattedBalance.rawValue + Number(currentCargo.paid_amount)) ===
        0
    ) {
      console.log("case 1");
      // +
      return newCurrBalanceFullSinglePayment;
    } else if (
      Number(currentCargo.amount.value) - currentCargo.paid_amount ===
      0
    ) {
      // +
      console.log("case 2");
      return newCurrBalanceEqualZero;
    } else if (comparison > 0) {
      // +
      console.log("case 3");
      return newCurrBalanceGreaterThanZero;
    } else if (comparison < 0) {
      // +
      console.log("case 4");
      return newCurrBalanceLessThanZero;
    } else if (comparison == 0) {
      // +
      console.log("case 5");
      return newCurrBalanceLessThanZero;
    }
  };

  const { mutate: updateBalance } = useMutation({
    mutationFn: async () => {
      const cargo = info.row.original.cargos.find((e) => e.id == formState);
      const [currentBalance, _] = calculateNewDuty(cargo);
      console.log("Работает updateBalance");
      return await changeClientBalance(
        info.row.original.id,
        Number(currentBalance)
      );
    },
  });

  const { user } = useUser();

  const { mutate: addOperation } = useMutation({
    mutationFn: async () => {
      addOperations(info.row.original.operations, info.row.original.id, {
        amount: Number(formattedBalance.rawValue),
        date: new Date().toString(),
        user_id: user.id,
        cargo_id: info.row.original.cargos.find((e) => e.id == formState).id,
      });
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const cargo = info.row.original.cargos.find((e) => e.id == formState);
      const [_, paidAmount] = calculateNewDuty(cargo);

      return await changeExactAmountPaidToCargo(
        info.row.original.cargos.find((e) => e.id == formState),
        Number(paidAmount)
      );
    },
    onSuccess: () => {
      updateBalance();
      addOperation();
      const cargo = info.row.original.cargos.find((e) => e.id == formState);
      toast({
        title: `Успех`,
        description: `Вы успешно добавили оплату для груза №${cargo.id} в №${cargo.trip_number} рейсе`,
      });
      disclosure.onOpenChange();
    },
    onError: () => {
      toast({
        title: `Ошибка`,
        description: `Не удалось добавить оплату для груза №${cargo.id} в №${cargo.trip_number} рейсе`,
      });
    },
  });

  const { openModal } = useConfirmContext();

  const submit = (e) => {
    e.preventDefault();

    const client = `${info.row.original.client.full_name.first_name} ${info.row.original.client.full_name.last_name} ${info.row.original.client.company_name && `который работает на ${info.row.original.client.company_name}`}`;
    const tripId = `${info.row.original.cargos.find((e) => e.id == formState).trip_number}`;
    openModal({
      action: async () => mutate(),
      isLoading: isPending,
      title: `Вы уверены что хотите внести оплату?`,
      description: (
        <div className="flex flex-col gap-4">
          <span>
            Подтвердите что хотите добавить{" "}
            <span className="font-semibold">{formattedBalance.value} тг</span> в{" "}
            <span className="font-semibold">{tripId}</span> рейс к{" "}
            <span className="font-semibold">{client}</span>
          </span>
          <span className="font-semibold text-medium text-danger text-center">
            Это действие невозможно будет отменить
          </span>
        </div>
      ),
      buttonName: "Добавить оплату",
      modalProps: {
        backdrop: "blur",
      },
    });
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      isDismissable={false}
    >
      <ModalContent>
        <form
          onSubmit={(e) => {
            submit(e);
          }}
        >
          <ModalHeader className="flex flex-col gap-1">
            Внести платеж за груз
          </ModalHeader>
          <Divider />
          <ModalBody className="flex flex-col gap-2">
            <div className="flex gap-2">
              <AutocompleteTrips
                cargo={cargo}
                form={[formState, setFormState]}
                info={info}
              />
              <Tooltip
                content={"Использовать текущий баланс клиента"}
                showArrow={true}
                offset={-7}
              >
                <div className="flex items-center justify-center">
                  <Checkbox
                    isSelected={isUsingBalance}
                    onValueChange={(e) => {
                      setIsUsingBalance(e);
                    }}
                  />
                </div>
              </Tooltip>
            </div>
            <AlreadyPaidBadge info={info} formState={formState} />
            <Input
              errorMessage="Добавьте баланс"
              label="Оплата"
              value={formattedBalance.value}
              onChange={(e) => {
                formattedBalance.onChange(e);
              }}
              endContent={isUsingBalance && <InputEndContent info={info} />}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                disclosure.onOpenChange();
              }}
              isLoading={isPending}
            >
              Закрыть
            </Button>
            <Button color="success" type="submit" isLoading={isPending}>
              Внести платеж
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const AutocompleteTrips = ({
  cargo,
  form,
  info,
}: {
  cargo: CashboxTableType["cargos"][number];
  form: [null | number, Dispatch<SetStateAction<Number | null>>];
  info: Cell<CashboxTableType, React.ReactNode>;
}) => {
  const [formState, setFormState] = form;

  return (
    <>
      <Autocomplete
        defaultSelectedKey={cargo && cargo?.id}
        label="Выберите груз"
        selectedKey={formState?.toString() || null}
        onSelectionChange={(e) => {
          setFormState(Number(e));
        }}
      >
        {info.row.original.cargos?.map((el) => {
          const number = getSeparatedNumber(Number(el.amount.value));
          const tripNumber = cargo?.trip_number;
          return (
            <AutocompleteItem
              value={el.id}
              key={el.id}
              textValue={`№${tripNumber} - ${number} тг`}
            >
              {`№${tripNumber} - ${number} тг`}
            </AutocompleteItem>
          );
        })}
      </Autocomplete>
    </>
  );
};

const InputEndContent = ({ info }: { info: AddPaymentToCargoArgs["info"] }) => {
  const val = getSeparatedNumber(Number(info.row.original.current_balance));
  return <span className="text-sm">+&nbsp;{val}</span>;
};

const AlreadyPaidBadge = ({
  info,
  formState,
}: {
  info: AddPaymentToCargoArgs["info"];
  formState: number;
}) => {
  const tmp = getSeparatedNumber(
    info.row.original.cargos.find((e) => e.id == formState)?.paid_amount
  );

  return (
    tmp && (
      <span className="text-xs pl-1 ">
        Оплачено:&nbsp;
        {tmp || ""}
      </span>
    )
  );
};
