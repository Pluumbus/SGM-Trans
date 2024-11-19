import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ReactNode } from "react";

export type UseConfirmModalPropsType = {
  disclosure: {
    onOpenChange: () => void;
    isOpen: boolean;
  };
  title: ReactNode;
  buttonName?: ReactNode;
  description?: ReactNode;
  action: () => Promise<void>;
  isLoading: boolean;
};

export const ConfirmModal = ({
  disclosure,
  title,
  description,
  buttonName,
  action,
  isLoading,
}: UseConfirmModalPropsType) => {
  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <span>{title}</span>
        </ModalHeader>
        {description && (
          <>
            <Divider />
            <ModalBody>{description}</ModalBody>
          </>
        )}
        <Divider />
        <ModalFooter>
          <div className="flex justify-end gap-4">
            <Button
              variant="light"
              color="danger"
              isLoading={isLoading}
              onClick={() => {
                disclosure.onOpenChange();
              }}
            >
              Закрыть
            </Button>
            <Button
              variant="ghost"
              color="success"
              isLoading={isLoading}
              onClick={() => {
                action().then(() => {
                  disclosure.onOpenChange();
                });
              }}
            >
              {buttonName ? buttonName : "Создать"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
