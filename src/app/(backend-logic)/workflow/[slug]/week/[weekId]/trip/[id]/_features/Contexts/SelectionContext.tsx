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
  (id: number | undefined) => void,
];

const SelectionContext = createContext<ExampleContextType | undefined>(
  undefined
);

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = useState<RowSelectionType[]>();

  const changeIsSelected = (id: number | undefined) => {
    if (id) {
      setValue((prev) =>
        prev?.map((item) =>
          item.number === id ? { ...item, isSelected: !item.isSelected } : item
        )
      );
    } else {
      setValue((prev) =>
        prev?.every((e) => e.isSelected)
          ? prev?.map((item) => ({
              ...item,
              isSelected: false,
            }))
          : prev?.map((item) => ({
              ...item,
              isSelected: true,
            }))
      );
    }
  };

  return (
    <SelectionContext.Provider value={[value, setValue, changeIsSelected]}>
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
