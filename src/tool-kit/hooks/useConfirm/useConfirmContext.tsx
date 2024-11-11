"use client";
import { createContext, useContext, useState } from "react";
import { ConfirmModal, UseConfirmModalPropsType } from "./Modal";
import { useDisclosure } from "@nextui-org/react";

const ConfirmContext = createContext<{
  openModal: (props: Omit<UseConfirmModalPropsType, "disclosure">) => void;
} | null>(null);

export const useConfirmContext = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirmContext must be used within a ConfirmProvider");
  }
  return context;
};

// @ts-ignore
export const ConfirmProvider: React.FC = ({ children }) => {
  const [modalProps, setModalProps] = useState<Omit<
    UseConfirmModalPropsType,
    "disclosure"
  > | null>(null);
  const disclosure = useDisclosure();

  const openModal = (props: Omit<UseConfirmModalPropsType, "disclosure">) => {
    setModalProps(props);
    disclosure.onOpenChange();
  };

  return (
    <ConfirmContext.Provider value={{ openModal }}>
      {children}
      {modalProps && (
        <ConfirmModal
          {...modalProps}
          disclosure={{ ...disclosure, isOpen: disclosure.isOpen }}
        />
      )}
    </ConfirmContext.Provider>
  );
};
