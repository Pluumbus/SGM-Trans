import { TableCell, TableRow } from "@nextui-org/react";
import { Table, flexRender } from "@tanstack/react-table";
import { RowConfigProps } from "../types";

export const renderRows = <T,>(
  tInstance: Table<T>,
  config: RowConfigProps<T>,
) => {
  return tInstance.getRowModel().rows.map((row) => (
    <TableRow className={config?.className} key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          onClick={() => {
            if (cell.column.columnDef.accessorKey !== "action") {
              config.setRowData && config.setRowData(row);
            }
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));
};
