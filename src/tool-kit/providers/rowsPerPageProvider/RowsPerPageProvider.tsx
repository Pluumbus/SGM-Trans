"use client";
import { useLocalStorage } from "@/tool-kit/hooks";
import { createContext } from "react";

export type RowsPerPageContextType = {
  rowsPerPage: number | string;
  setRowsPerPage: (rowsPerPage: number | string) => void;
};

export const RowsPerPageContext = createContext<
  RowsPerPageContextType | undefined
>(undefined);

export const RowsPerPageProvider = ({ children }: any) => {
  const { data: rowsPerPage, setToLocalStorage: setRowsPerPage } =
    useLocalStorage({
      initialData: 10,
      identifier: "RowsPerPage",
    });

  const value = { rowsPerPage, setRowsPerPage };
  return (
    <RowsPerPageContext.Provider value={value}>
      {children}
    </RowsPerPageContext.Provider>
  );
};
