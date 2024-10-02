import { Input } from "@nextui-org/react";
import React from "react";

export const TableFilters = ({ headers }: any) => {
  return (
    <>
      {headers.map((header) =>
        header.column.getCanFilter() && header.column.columnDef.filter ? (
          <Input
            key={header.column.id}
            variant="underlined"
            label={`Отсортировать по ${header.column.columnDef.header.toString().toLowerCase()}`}
            value={(header.column.getFilterValue() ?? "") as string}
            onChange={(e) => {
              header.column.setFilterValue(e.target.value);
            }}
          />
        ) : null
      )}
    </>
  );
};
