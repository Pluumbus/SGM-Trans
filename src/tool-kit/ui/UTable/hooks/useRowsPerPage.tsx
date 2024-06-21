import {
  RowsPerPageContext,
  RowsPerPageContextType,
} from "@/tool-kit/providers/rowsPerPageProvider";
import { useContext } from "react";

export const useRowsPerPage = (): RowsPerPageContextType => {
  const context = useContext(RowsPerPageContext);
  if (context === undefined) {
    throw new Error("useRowsPerPage must be used within a RowsPerPageProvider");
  }
  return context;
};
