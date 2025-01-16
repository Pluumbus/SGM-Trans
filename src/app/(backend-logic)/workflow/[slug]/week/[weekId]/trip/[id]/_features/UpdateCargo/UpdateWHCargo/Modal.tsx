import { WHCargoType } from "@/app/(backend-logic)/workflow/_feature/AddCargoModal/WHcargo/types";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";

export const WHModal = () => {
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>Обновить груз</ModalHeader>
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
};
