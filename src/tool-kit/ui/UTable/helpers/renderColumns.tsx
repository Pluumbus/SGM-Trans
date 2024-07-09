import { TableColumn } from "@nextui-org/react";
import { Table, HeaderGroup, SortingState } from "@tanstack/react-table";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

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
        onClick={() => {
          setSorting([{ id: header.id, desc: !isSortedDesc }]);
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center" }}
          className="cursor-pointer hover:bg-opacity-20"
        >
          <span className="">
            {header.isPlaceholder
              ? null
              : header.column.columnDef.header?.toString()}
          </span>
          {isSorted && (
            <span style={{ marginLeft: "4px" }}>
              {isSortedDesc ? (
                <FaArrowUp className="text-[0.6rem]" />
              ) : (
                <FaArrowDown className="text-[0.6rem]" />
              )}
            </span>
          )}
        </div>
      </TableColumn>
    );
  });
};
