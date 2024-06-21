import { Cell, ColumnDef, Row } from "@tanstack/react-table";
import { ReactNode } from "react";

export type DataType<T> = Record<string, T>;

type ColumnType<T> = ColumnDef<DataType<T>>;

export type RowConfigProps<T> = {
  setRowData?: (info: Row<T>) => void;
  className?: string;
};

export type UseTableConfig<T> = {
  row: RowConfigProps<T>;
};

export type UseTableProps<T> = {
  name: string;
  data: DataType<T>[];
  columns: ColumnType<T>[];
  config?: UseTableConfig<T>;
};

export type UseTableColumnsSchema<T> = Array<{
  accessorKey: string;
  accessorFn?: (info: Cell<T, ReactNode>) => any;
  header: string;
  size?: number;
  cell: (info: Cell<T, ReactNode>) => ReactNode;
  filter: boolean;
}>;
