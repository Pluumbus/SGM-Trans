"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { CargoType } from "../../_feature/types";

type ContextProviderProps = {
  children: React.ReactNode;
};

type CashboxTableModeType = "MSK" | "KZ" | "Arrived" | "none";

type ContextType = {
  mode: CashboxTableModeType;
  setMode: Dispatch<SetStateAction<CashboxTableModeType>>;
  cargos: CargoType[];
  setCargos: Dispatch<SetStateAction<CargoType[]>>;
};

export const Context = createContext({} as ContextType);

export const CashboxModeContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [mode, setMode] = useState<CashboxTableModeType>("none");
  const [cargos, setCargos] = useState<CargoType[]>([]);

  return (
    <Context.Provider
      value={{
        mode,
        setMode,
        cargos,
        setCargos,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCashboxMode = (): ContextType => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useCashboxMode must be used within an ExampleProvider");
  }

  return context;
};
