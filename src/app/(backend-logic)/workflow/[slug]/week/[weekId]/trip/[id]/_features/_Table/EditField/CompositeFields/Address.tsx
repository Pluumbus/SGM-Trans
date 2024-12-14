import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { FaMapLocation } from "react-icons/fa6";
import { Text } from "../Text";

export const Address = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const disclosure = useDisclosure();
  return (
    <div>
      <Tooltip content={<span>{info.getValue() || ""}</span>}>
        <Button
          isIconOnly
          onClick={() => {
            disclosure.onOpenChange();
          }}
          variant="light"
        >
          <FaMapLocation size={20} />
        </Button>
      </Tooltip>
      <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
        <ModalContent>
          <ModalHeader>Адрес получения</ModalHeader>
          <Divider />
          <ModalBody>
            <Text info={info} />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <div className="w-full flex justify-end">
              <Button
                variant="light"
                color="danger"
                onClick={() => {
                  disclosure.onOpenChange();
                }}
              >
                Закрыть
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
