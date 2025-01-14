import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type CargoKey = [keyof CargoType, Dispatch<SetStateAction<keyof CargoType>>];

const CargoTableContext = createContext<CargoKey>(undefined);

export const CargoTableProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = useState<keyof CargoType>();

  const contextValue = {
    value,
    setValue,
  };

  return (
    <CargoTableContext.Provider value={[value, setValue]}>
      {children}
    </CargoTableContext.Provider>
  );
};

export const useFieldFocus = (): CargoKey => {
  const context = useContext(CargoTableContext);

  if (!context) {
    throw new Error("useFieldFocus must be used within an ExampleProvider");
  }

  return context;
};
