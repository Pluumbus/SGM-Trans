import { TableColumn } from "@nextui-org/react";
import { Table, HeaderGroup, SortingState } from "@tanstack/react-table";

type TableInstance<T> = Table<T> & {
  setSorting: (sorting: SortingState) => void;
  getHeaderGroups: () => HeaderGroup<T>[];
  getState: () => { sorting: SortingState };
};

export const renderColumns = <T,>(tInstance: TableInstance<T>) => {
  const { setSorting } = tInstance;

  return tInstance.getHeaderGroups()[0].headers.map((header) => {
    const isSorted = tInstance
      .getState()
      .sorting.some((sort) => sort.id === header.id);
    const isSortedDesc = tInstance
      .getState()
      .sorting.find((sort) => sort.id === header.id)?.desc;

    return (
      <TableColumn
        style={{ width: `${header.getSize()}px` }}
        key={header.id}
        allowsSorting
        onClick={() => {
          setSorting([{ id: header.id, desc: !isSortedDesc }]);
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {header.isPlaceholder
            ? null
            : header.column.columnDef.header?.toString()}
          {isSorted && (
            <span style={{ marginLeft: "4px" }}>
              {isSortedDesc ? "🔽" : "🔼"}
            </span>
          )}
        </div>
      </TableColumn>
    );
  });
};
