"use client";
import { useLocalStorage } from "@/tool-kit/hooks";
import { createContext, ReactNode } from "react";

export type RowsPerPageContextType = {
  rowsPerPage: number | string;
  setRowsPerPage: (rowsPerPage: number | string) => void;
};

export const RowsPerPageContext = createContext<
  RowsPerPageContextType | undefined
>(undefined);

type RowsPerPageProviderProps = {
  children: ReactNode;
};

export const RowsPerPageProvider = ({ children }: RowsPerPageProviderProps) => {
  const { data: rowsPerPage, setToLocalStorage } = useLocalStorage<
    number | string
  >({
    initialData: 10,
    identifier: "RowsPerPage",
  });

  const setRowsPerPage = (rowsPerPage: number | string) => {
    setToLocalStorage(rowsPerPage);
  };

  const value = { rowsPerPage, setRowsPerPage };
  return (
    <RowsPerPageContext.Provider value={value}>
      {children}
    </RowsPerPageContext.Provider>
  );
};
