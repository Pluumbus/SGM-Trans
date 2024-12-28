"use client";
import { createContext, ReactNode, useState } from "react";

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
  const [rowsPerPage, setToLocalStorage] = useState<number | string>(10);

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
