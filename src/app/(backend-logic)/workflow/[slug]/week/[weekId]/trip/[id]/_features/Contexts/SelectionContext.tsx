"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type RowSelectionType = {
  number: number;
  isSelected: boolean;
};

type ExampleContextType = [
  RowSelectionType[],
  Dispatch<SetStateAction<RowSelectionType[]>>,
];

const SelectionContext = createContext<ExampleContextType | undefined>(
  undefined
);

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = useState<RowSelectionType[]>();

  return (
    <SelectionContext.Provider value={[value, setValue]}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelectionContext = (): ExampleContextType => {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error("useExampleContext must be used within an ExampleProvider");
  }

  return context;
};
