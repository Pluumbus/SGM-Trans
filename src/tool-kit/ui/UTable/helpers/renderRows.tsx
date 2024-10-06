import { Divider, TableCell, TableRow } from "@nextui-org/react";
import { Table, flexRender } from "@tanstack/react-table";
import { RowConfigProps } from "../types";

export const renderRows = <T,>(
  tInstance: Table<T>,
  config: RowConfigProps<T>
) => {
  return tInstance.getRowModel().rows.map((row, i) => (
    <TableRow className={config?.className} key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className="border-r-1 border-e-gray-200 py-0 h-full"
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
