import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { ReactNode } from "react";

export type UseConfirmModalPropsType = {
  disclosure: {
    onOpenChange: () => void;
    isOpen: boolean;
  };
  title: ReactNode;
  buttonName?: ReactNode;
  modalProps?: Omit<ModalProps, "children">;
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
  modalProps,
}: UseConfirmModalPropsType) => {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      {...modalProps}
    >
      <ModalContent>
        <ModalHeader>
          <span>{title}</span>
        </ModalHeader>

        <Divider />
        <ModalBody>
          {description || (
            <span className="text-danger font-semibold">
              Это действие нельзя будет отменить
            </span>
          )}
        </ModalBody>

        <Divider />
        <ModalFooter>
          <div className="flex justify-end gap-4">
            <Button
              variant="light"
              color="danger"
              isLoading={isLoading}
              onPress={() => {
                disclosure.onOpenChange();
              }}
            >
              Закрыть
            </Button>
            <Button
              variant="ghost"
              color="success"
              isLoading={isLoading}
              onPress={() => {
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
