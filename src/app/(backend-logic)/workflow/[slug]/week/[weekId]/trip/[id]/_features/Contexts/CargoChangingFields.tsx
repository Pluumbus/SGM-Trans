import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type CargoChangingFieldsContextProviderProps = {
  children: React.ReactNode;
};

type CargoChangingFieldsContextType = {
  field: {
    changedField: Array<keyof CargoType> | null;
    setChangedField: Dispatch<SetStateAction<Array<keyof CargoType> | null>>;
  };
};

export const CargoChangingFieldsContext = createContext(
  {} as CargoChangingFieldsContextType
);

export const CargoChangingFieldsContextProvider = ({
  children,
}: CargoChangingFieldsContextProviderProps) => {
  const [changedField, setChangedField] = useState<Array<
    keyof CargoType
  > | null>(null);

  return (
    <CargoChangingFieldsContext.Provider
      value={{
        field: {
          changedField,
          setChangedField,
        },
      }}
    >
      {children}
    </CargoChangingFieldsContext.Provider>
  );
};

export const useCargosField = (): CargoChangingFieldsContextType => {
  const context = useContext(CargoChangingFieldsContext);

  if (!context) {
    throw new Error(
      "useCargosVisibility must be used within an ExampleProvider"
    );
  }

  return context;
};
