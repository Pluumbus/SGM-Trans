import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

export const ReqModal = ({
  disclosure,
}: {
  disclosure: ReturnType<typeof useDisclosure>;
}) => {
  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        <ModalHeader>Начать работу?</ModalHeader>
        <ModalFooter>
          <Button
            variant="ghost"
            color="danger"
            onPress={disclosure.onOpenChange}
          >
            Отмена
          </Button>
          <Button color="success">Начать</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
