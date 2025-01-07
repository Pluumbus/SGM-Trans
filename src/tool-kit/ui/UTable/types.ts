import { TableBodyProps, TableProps } from "@nextui-org/react";
import {
  AccessorFn,
  Cell,
  ColumnDef,
  FilterFn,
  Row,
} from "@tanstack/react-table";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

export type DataType<T> = Record<string, T>;

export type ColumnType<T> = ColumnDef<DataType<T>>;

export enum TABLE_COLORS {
  PINK = "bg-pink-400",
  GREEN = "bg-success",
}

export type RowConfigProps<T> = {
  setRowData?: (info: Row<T>) => void;
  setClassNameOnRow?: (info: Row<T>) => string;
  className?: string;
};

export type UseTableConfig<T> = {
  row: RowConfigProps<T>;
};

export type UseTableProps<T> = {
  name: string;
  data: T[];
  // columns: Array<UseTableColumnsSchema<T> & ColumnDef<T, any>>; #TODO: CHECK ???
  columns: Array<UseTableColumnsSchema<T>>;
  isPagiantion?: boolean;
  props?: TableProps;
  tBodyProps?: Omit<TableBodyProps<T>, "children">;
  config?: UseTableConfig<T>;
};

export type UseTableColumnsSchema<T> = {
  accessorKey: string;
  accessorFn?: AccessorFn<T, any>;
  header: ReactNode | (() => JSX.Element);
  size?: number;
  cell: (info: Cell<T, ReactNode>) => ReactNode;
  filter: boolean;
  filterBy?: string[];
  filterFn?: string | FilterFn<any> | undefined;
};
