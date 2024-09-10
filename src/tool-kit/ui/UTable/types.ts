import {
  AccessorFn,
  Cell,
  ColumnDef,
  FilterFn,
  Row,
} from "@tanstack/react-table";
import { ReactNode } from "react";

export type DataType<T> = Record<string, T>;

export type ColumnType<T> = ColumnDef<DataType<T>>;

export type RowConfigProps<T> = {
  setRowData?: (info: Row<T>) => void;
  className?: string;
};

export type UseTableConfig<T> = {
  row: RowConfigProps<T>;
};

export type UseTableProps<T> = {
  name: string;
  data: T[];
  // columns: Array<UseTableColumnsSchema<T> & ColumnDef<T, any>>; #TODO: CHECK ???
  columns: Array<UseTableColumnsSchema<T> >;
  isPagiantion?: boolean;
  config?: UseTableConfig<T>;
};

export type UseTableColumnsSchema<T> = {
  accessorKey: string;
  accessorFn?: AccessorFn<T, any>;
  header: string;
  size?: number;
  cell: (info: Cell<T, ReactNode>) => ReactNode;
  filter: boolean;
  filterFn?: string | undefined;
};
