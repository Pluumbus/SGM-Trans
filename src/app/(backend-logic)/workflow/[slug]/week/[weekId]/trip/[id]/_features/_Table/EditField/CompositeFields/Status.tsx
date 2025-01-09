import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode, useState } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import {
  Button,
  DatePicker,
  DateValue,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { formatDate } from "@/lib/helpers";
import { FaCalendar } from "react-icons/fa6";

type Type = CargoType["status"];

export const Status = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  const [estDate, setEstDate] = useState<DateValue>(
    values
      ? parseDate(formatDate(new Date(values?.toString())?.toISOString()))
      : today(getLocalTimeZone()).add({ days: 7 })
  );

  const disclosure = useDisclosure();

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => {
          disclosure.onOpenChange();
        }}
      >
        {info.getValue() || "-"}
      </div>
      <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
        <ModalContent>
          <ModalHeader>Изменить дату поступления на склад</ModalHeader>
          <Divider />
          <ModalBody>
            <DatePicker
              variant="bordered"
              aria-label="Estemated date"
              value={estDate}
              onChange={(e) => {
                setEstDate(e);
                setValues(() => `${e.year}-${e.month}-${e.day}`);
              }}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              variant="light"
              color="danger"
              onPress={() => {
                disclosure.onOpenChange;
              }}
            >
              Отмена
            </Button>
            <Button
              variant="flat"
              color="success"
              onPress={() => {
                disclosure.onOpenChange;
              }}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
