import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { useDisclosure } from "@nextui-org/react";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";

import { Text } from "../Text";

export const Address = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const disclosure = useDisclosure();
  return (
    <div className="min-w-40 my-2">
      <Text info={info} cl="max-h-40" />

      {/* <Tooltip content={<span>{info.getValue() || ""}</span>}>
        <Button
          isIconOnly
          onPress={() => {
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
                onPress={() => {
                  disclosure.onOpenChange();
                }}
              >
                Закрыть
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </div>
  );
};
