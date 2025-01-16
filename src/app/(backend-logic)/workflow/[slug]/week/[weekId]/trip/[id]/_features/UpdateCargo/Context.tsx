"use client";
import { WHCargoType } from "@/app/(backend-logic)/workflow/_feature/AddCargoModal/WHcargo/types";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { useDisclosure } from "@nextui-org/react";
import { Row } from "@tanstack/react-table";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type UpdateCargoContextProviderProps = {
  children: React.ReactNode;
};

type UpdateCargoContextType = {
  disclosure: ReturnType<typeof useDisclosure>;
  sntDisclosure: ReturnType<typeof useDisclosure>;
  row: CargoType;
  setRow: Dispatch<SetStateAction<CargoType>>;
  whRow: WHCargoType;
  setWhRow: Dispatch<SetStateAction<WHCargoType>>;
};

export const UpdateCargoContext = createContext({} as UpdateCargoContextType);

export const UpdateCargoContextProvider = ({
  children,
}: UpdateCargoContextProviderProps) => {
  const disclosure = useDisclosure();
  const sntDisclosure = useDisclosure();
  const [row, setRow] = useState<CargoType>();
  const [whRow, setWhRow] = useState<WHCargoType>();
  return (
    <UpdateCargoContext.Provider
      value={{
        disclosure,
        sntDisclosure,
        row,
        setRow,
        whRow,
        setWhRow,
      }}
    >
      {children}
    </UpdateCargoContext.Provider>
  );
};

export const useUpdateCargoContext = (): UpdateCargoContextType => {
  const context = useContext(UpdateCargoContext);

  if (!context) {
    throw new Error(
      "useUpdateCargoContext must be used within an ExampleProvider"
    );
  }

  return context;
};
