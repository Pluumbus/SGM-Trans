import { TableCell, TableRow } from "@nextui-org/react";
import { Table, flexRender } from "@tanstack/react-table";
import { DataType, RowConfigProps } from "../types";

export const renderRows = <T extends DataType<T>>(
  tInstance: Table<T>,
  config: RowConfigProps<T>,
) => {
  return tInstance.getRowModel().rows.map((row) => (
    <TableRow
      className={config?.className}
      key={row.id}
      onClick={() => {
        config.setRowData && config.setRowData(row);
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));
};
