import { useMemo } from "react";
import { TableFilter } from "../ui/TableFilter";

export const Filters = ({ tInstance }) => {
  const filters = useMemo(() => {
    return tInstance
      .getHeaderGroups()[0]
      .headers.filter((header) => header.column.columnDef.filter)
      .map((header) => (
        <TableFilter
          key={header.id}
          headerId={header.id}
          tInstance={tInstance}
        />
      ));
  }, []);

  return <>{filters}</>;
};
