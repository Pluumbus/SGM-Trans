import { Input } from "@nextui-org/react";

export const TableFilters = ({ headers }: any) => {
  return (
    <>
      {headers.map((header) =>
        header.column.getCanFilter() && header.column.columnDef.filter ? (
          <Input
            key={header.column.id}
            variant="underlined"
            label={`Filter by ${header.column.id}`}
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
