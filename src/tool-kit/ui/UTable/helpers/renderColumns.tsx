import { TableColumn } from "@nextui-org/react";
import { Table } from "@tanstack/react-table";
import { DataType } from "../types";

export const renderColumns = (tInstance: Table<DataType>) => {
  const { setSorting } = tInstance;
  return tInstance.getHeaderGroups()[0].headers.map((header) => (
    <TableColumn
      style={{ width: `${header.getSize()}px` }}
      key={header.id}
      allowsSorting
      isSorted={
        tInstance.getState().sorting.find((sort) => sort.id === header.id) !==
        undefined
      }
      isSortedDesc={
        tInstance.getState().sorting.find((sort) => sort.id === header.id)?.desc
      }
      onClick={() => {
        const isSortedDesc = tInstance
          .getState()
          .sorting.find((sort) => sort.id === header.id)?.desc;
        setSorting([{ id: header.id, desc: !isSortedDesc }]);
      }}
    >
      {header.isPlaceholder ? null : header.column.columnDef.header?.toString()}
    </TableColumn>
  ));
};
