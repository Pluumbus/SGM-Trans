import React, {
  createContext,
  useState,
  ReactNode,
  FC,
  useContext,
} from "react";

type TableMode = "cargo" | "wh-cargo";

interface TableModeContextType {
  tableMode: TableMode;
  setTableMode: React.Dispatch<React.SetStateAction<TableMode>>;
}

const TableModeContext = createContext<TableModeContextType | undefined>(
  undefined
);

interface TableModeProviderProps {
  children: ReactNode;
  mode?: TableMode;
}

export const TableModeProvider: FC<TableModeProviderProps> = ({
  children,
  mode = "cargo",
}) => {
  const [tableMode, setTableMode] = useState<TableMode>(mode);

  return (
    <TableModeContext.Provider value={{ tableMode, setTableMode }}>
      {children}
    </TableModeContext.Provider>
  );
};

export const useTableMode = () => {
  const context = useContext(TableModeContext);
  if (!context) {
    return { tableMode: "cargo" } as { tableMode: TableMode };
  }
  return context;
};
