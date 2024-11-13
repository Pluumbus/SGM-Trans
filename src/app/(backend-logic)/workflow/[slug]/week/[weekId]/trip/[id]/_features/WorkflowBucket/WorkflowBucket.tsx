"use client";
import Image from "next/image";
import basket from "@/app/_imgs/delete.png";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { AddDocuments } from "./features/AddDocuments";
import { DocumentsList } from "./features/DocumentsList";

export const WorkflowBucket = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button onPress={onOpen} className="h-14 flex bg-gray-200" size="sm">
        <b>Документы</b>
        <Image src={basket} alt="doc-basket" width={48} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Корзина документов
              </ModalHeader>
              <ModalBody>
                <AddDocuments />
                <DocumentsList />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
