"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode, useEffect, useState } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { toast, useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { setUserBalance } from "@/lib/references/clerkUserType/SetUserFuncs";
import { FaCircleXmark, FaDownload } from "react-icons/fa6";
import { useCheckRole } from "@/components/RoleManagment/useRole";
import { PrintButton } from "@/components/ActPrinter/actGen";
import { IoCheckmark } from "react-icons/io5";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import { TIME, useNotifications } from "@/tool-kit/Notification";
import { getSeparatedNumber } from "@/tool-kit/hooks";

type Type = CargoType["act_details"];

export const PrintAct = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] =
    useCompositeStates<Pick<Type, "is_ready" | "user_id">>(info);

  const { user } = useUser();
  const disclosure = useDisclosure();
  const initText = `Одобрить`;
  const [givingActText, setGivingActText] = useState<string>(initText);

  const { toast } = useToast();
  const isReadyToGive = () => {
    const condition =
      (user.publicMetadata.balance as number) -
        (Number(info.row.original.amount.value) -
          Number(info.row.original.paid_amount)) >=
      0;

    return condition
      ? disclosure.onOpenChange()
      : toast({
          title: (
            <div className="flex gap-2 items-center leading-4">
              <span className="text-danger-600">
                <FaCircleXmark size={20} />
              </span>
              <span>У вас недостаточно баланса для одобрения груза</span>
            </div>
          ) as string & ReactNode,
        });
  };

  const conditionIsReadyToGiveAct =
    values.is_ready ||
    Number(info.row.original.amount.value) -
      Number(info.row.original.paid_amount) ==
      0;

  const { data: usersList, isLoading } = useQuery({
    queryKey: ["getUsersList"],
    queryFn: async () => await getUserList(),
  });

  useEffect(() => {
    if (usersList) {
      const currUser = usersList.filter(
        (user) => user.id == values?.user_id
      )[0];
      if (values.is_ready) {
        setGivingActText(`Одобрил: ${currUser?.userName}`);
      } else {
        setGivingActText(initText);
      }
    }
  }, [usersList]);

  const check = useCheckRole(["Менеджер"]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-2 w-[2rem]">
      <div className="flex flex-col gap-2 w-full items-center">
        {check ? null : values.is_ready ? null : conditionIsReadyToGiveAct ? (
          <span>Одобрено Кассой</span>
        ) : (
          <Tooltip content={<span>Одобрить?</span>}>
            <Button
              onPress={() => {
                isReadyToGive();
              }}
              isIconOnly
              variant="light"
            >
              <IoCheckmark size={20} />
            </Button>
          </Tooltip>
        )}
        {conditionIsReadyToGiveAct && (
          <div className="w-full">
            <PrintButton
              actData={{
                client_bin: info.row.original.client_bin.tempText,
                cargo_name: info.row.original.cargo_name,
                quantity: info.row.original.quantity.value,
                amount: info.row.original.amount.value,
                date: new Date().toLocaleDateString(),
              }}
            />
          </div>
        )}
      </div>
      <GlobalActModal
        info={info}
        disclosure={disclosure}
        cargoInfo={{
          cargoPrice: Number(info.row.original.amount.value),
          cargoPaidAmount: Number(info.row.original.paid_amount),
        }}
        setValues={setValues}
      />
    </div>
  );
};

const GlobalActModal = ({
  disclosure,
  cargoInfo,
  info,
  setValues,
}: {
  disclosure: { onOpenChange: () => void; isOpen: boolean };
  info: Cell<CargoType, ReactNode>;
  cargoInfo: {
    cargoPrice: number;
    cargoPaidAmount: number;
  };
  setValues: React.Dispatch<React.SetStateAction<CargoType["act_details"]>>;
}) => {
  const { user } = useUser();

  const { mutate: setBalanceMutation, isPending } = useMutation({
    mutationFn: async (newBal: number) => {
      await setUserBalance({
        userId: user.id,
        publicMetadata: {
          balance: newBal,
        },
      });
    },
    onSuccess: () => {
      setValues(() => ({
        is_ready: true,
        user_id: user.id,
        amount: cargoInfo.cargoPrice,
        date_of_act_printed: new Date().toISOString(),
      }));
      disclosure.onOpenChange();
      toast({ title: `Печать талона на груз одобрена` });

      scheduleRecurringNotification();
    },
  });

  const { notificationMutation } = useNotifications();
  const scheduleRecurringNotification = () => {
    const cargo = info.row.original;
    notificationMutation.mutate({
      data: {
        users: [user.id],
        message: `Оповещение: ${cargo.client_bin.tempText} еще не оплатил ${getSeparatedNumber(Number(cargo.amount.value))}тг за груз`,
        type: "warning",
        stopCondition: cargo.paid_amount == Number(cargo.amount.value),
      },
      delayMs: TIME.NOW,
      repeatMs: TIME.MINUTE,
    });
  };
  // sum to substract from logist balance
  const logistSum = cargoInfo.cargoPrice - cargoInfo.cargoPaidAmount;
  return (
    <Modal onOpenChange={disclosure.onOpenChange} isOpen={disclosure.isOpen}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 ">
          Одобрение груза
        </ModalHeader>
        <ModalBody>
          <p>
            При соглашении у вас спишется стоимость груза с баланса в размере{" "}
            <b>{`${logistSum}`}</b> и появится возможность распечатать Акт
            приема-выдачи
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            isLoading={isPending}
            onPress={() => {
              setValues((prev) => ({ ...prev, value: false }));
            }}
          >
            Закрыть
          </Button>

          <Button
            isLoading={isPending}
            color="success"
            onPress={() => {
              setBalanceMutation(
                Number(user.publicMetadata.balance) - logistSum
              );
            }}
          >
            Да
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
