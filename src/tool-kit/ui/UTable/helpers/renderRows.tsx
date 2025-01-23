import { TableCell, TableRow } from "@nextui-org/react";
import { Table, flexRender } from "@tanstack/react-table";
import { RowConfigProps } from "../types";
import { cx } from "class-variance-authority";

export const renderRows = <T,>(
  tInstance: Table<T>,
  config: RowConfigProps<T>,
  highlightedRows: Set<string>,
  toggleHighlight: (rowId: string) => void
) => {
  return tInstance.getRowModel().rows.map((row, i) => (
    <TableRow
      className={cx(
        config.setClassNameOnRow && config?.setClassNameOnRow(row),
        config?.className,
        // i % 2 == 0 ? "bg-orange-100" :
        "bg-slate-100",
        highlightedRows.has(row.id) && "bg-orange-300",
        "border border-b-2 border-e-gray-500"
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        toggleHighlight(row.id);
      }}
      key={row.id}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          onClick={() => {
            if (cell.column.columnDef.accessorKey == "action") return;
            config.setRowData && config.setRowData(row);
          }}
          className={cx(`border-r-1 border-e-gray-200 py-0 h-full`)}
        >
          <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
        </TableCell>
      ))}
    </TableRow>
  ));
};
