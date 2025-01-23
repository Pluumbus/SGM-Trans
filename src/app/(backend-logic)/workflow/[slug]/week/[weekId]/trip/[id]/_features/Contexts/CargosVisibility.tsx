"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type CargosVisibilityProviderProps = {
  children: React.ReactNode;
};

type CargosVisibilityType = {
  isOnlyMyCargos: boolean;
  setIsOnlyMyCargos: Dispatch<SetStateAction<boolean>>;
};

export const CargosVisibility = createContext({} as CargosVisibilityType);

export const CargosVisibilityProvider = ({
  children,
}: CargosVisibilityProviderProps) => {
  const [isOnlyMyCargos, setIsOnlyMyCargos] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("isOnlyMyCargos");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("isOnlyMyCargos", JSON.stringify(isOnlyMyCargos));
  }, [isOnlyMyCargos]);
  return (
    <CargosVisibility.Provider
      value={{
        isOnlyMyCargos,
        setIsOnlyMyCargos,
      }}
    >
      {children}
    </CargosVisibility.Provider>
  );
};

export const useCargosVisibility = (): CargosVisibilityType => {
  const context = useContext(CargosVisibility);

  if (!context) {
    throw new Error(
      "useCargosVisibility must be used within an ExampleProvider"
    );
  }

  return context;
};
