import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@nextui-org/react";
import { CashboxType } from "../../../types";
import { getSeparatedNumber } from "@/tool-kit/hooks";

export const Operations = ({
  disclosure,
  operations,
}: {
  disclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
  operations: CashboxType["operations"];
}) => {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader>Операции по клиенту</ModalHeader>
        <Divider />
        <ModalBody>
          <ScrollShadow className="w-full h-[400px]">
            <div>
              {operations ? (
                operations?.map((e, i) => (
                  <div key={i + 6} className="grid grid-cols-3">
                    <span>
                      {new Date(e.date).toLocaleDateString("RU")}&nbsp;в&nbsp;
                      {new Date(e.date).toLocaleTimeString("RU")}
                    </span>
                    <span>{getSeparatedNumber(e.amount)} тг</span>
                    <span>номер груза: {e.cargo_id}</span>
                  </div>
                ))
              ) : (
                <span>Операций по клиенту нет</span>
              )}
            </div>
          </ScrollShadow>
        </ModalBody>
        <Divider />
        <ModalFooter className="flex justify-end">
          <Button variant="light">Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
