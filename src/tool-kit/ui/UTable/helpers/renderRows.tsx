import { TableCell, TableRow } from "@nextui-org/react";
import { Table, flexRender } from "@tanstack/react-table";
import { RowConfigProps } from "../types";
import { cx } from "class-variance-authority";
import { useState } from "react";

export const renderRows = <T,>(
  tInstance: Table<T>,
  config: RowConfigProps<T>
) => {
  const [highlightedRows, setHighlightedRows] = useState<Set<string>>(
    new Set()
  );

  const toggleHighlight = (rowId: string) => {
    setHighlightedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };
  return tInstance.getRowModel().rows.map((row, i) => (
    <TableRow
      className={cx(
        config.setClassNameOnRow && config?.setClassNameOnRow(row),
        i % 2 == 0 ? "bg-orange-100" : "bg-slate-100",
        highlightedRows.has(row.id) && "bg-orange-300"
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
          className={cx(`border-r-1 border-e-gray-200 py-0 h-full`)}
          onClick={() => {
            if (cell.column.columnDef!.accessorKey !== "action") {
              config.setRowData && config.setRowData(row);
            }
          }}
        >
          <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
        </TableCell>
      ))}
    </TableRow>
  ));
};
