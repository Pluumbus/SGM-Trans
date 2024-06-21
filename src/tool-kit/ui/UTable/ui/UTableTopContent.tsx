import { useMemo } from "react";
import { ColumnSelector } from "./ColumnSelector";
import { TableFilters } from "./TableFilters";

export const UTableTopContent = ({ tInstance }: any) => {
  const headers = useMemo(
    () => tInstance.getHeaderGroups()[0].headers,
    [tInstance]
  );

  return (
    <div>
      <ColumnSelector tInstance={tInstance} />

      <div className="flex gap-4 items-end flex-wrap sm:flex-nowrap">
        <TableFilters headers={headers} />
      </div>
    </div>
  );
};
