import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type ContextProviderProps = {
  children: React.ReactNode;
};

type ContextType = {
  isOnlyMyCargos: boolean;
  setIsOnlyMyCargos: Dispatch<SetStateAction<boolean>>;
};

export const CargosVisibilityContext = createContext({} as ContextType);

export const CargosVisibility = ({ children }: ContextProviderProps) => {
  const [isOnlyMyCargos, setIsOnlyMyCargos] = useState<boolean>(false);
  return (
    <CargosVisibilityContext.Provider
      value={{
        isOnlyMyCargos,
        setIsOnlyMyCargos,
      }}
    >
      {children}
    </CargosVisibilityContext.Provider>
  );
};

export const useCargosVisibility = (): ContextType => {
  const context = useContext(CargosVisibilityContext);

  if (!context) {
    throw new Error(
      "useCargosVisibility must be used within an ExampleProvider"
    );
  }

  return context;
};
