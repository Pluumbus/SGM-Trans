import { useMemo } from "react";
import { ColumnSelector } from "./ColumnSelector";
import { TableFilters } from "./TableFilters";
import { Table } from "@tanstack/react-table";

export const UTableTopContent = <T,>({
  tInstance,
  name,
}: {
  tInstance: Table<T>;
  name: string;
}) => {
  const headers = useMemo(
    () => tInstance.getHeaderGroups()[0].headers,
    [tInstance]
  );

  return (
    <div className="mb-2 px-4">
      <ColumnSelector tInstance={tInstance} name={name} />

      <div className="flex gap-4 items-end flex-wrap sm:flex-nowrap">
        <TableFilters headers={headers} />
      </div>
    </div>
  );
};
