import { useMemo } from "react";
import { TableFilter } from "../ui/TableFilter";

export const Filters = ({ tInstance }: any) => {
  const filters = useMemo(() => {
    return tInstance
      .getHeaderGroups()[0]
      .headers.filter((header: any) => header.column.columnDef.filter)
      .map((header: any) => (
        <TableFilter
          key={header.id}
          headerId={header.id}
          header={header}
          tInstance={tInstance}
        />
      ));
  }, []);

  return <>{filters}</>;
};
