import { useDebounce } from "@/tool-kit/hooks";
import { Input } from "@nextui-org/react";
import { useState } from "react";

export const TableFilters = ({ headers }: any) => {
  return (
    <>
      {headers.map((header, i) =>
        header.column.getCanFilter() && header.column.columnDef.filter ? (
          <FilterInput header={header} key={i + 9} />
        ) : null
      )}
    </>
  );
};

const FilterInput = ({ header }: { header: any }) => {
  const [state, setState] = useState<string>(""); // для того чтобы убрать баг с задержкой ввода

  const { debounce } = useDebounce();

  const onChange = (value: string) => {
    setState(value);

    const filterBy = header.column.columnDef?.filterBy;
    debounce(() => {
      header.column.setFilterValue({
        filterValue: value,
        filterBy,
      });
    }, 300);
  };
  return (
    <Input
      key={header.column.id}
      variant="underlined"
      label={`Отсортировать по ${header.column.columnDef.header
        .toString()
        .toLowerCase()}`}
      value={state}
      // value={(header.column.getFilterValue()?.filterValue ?? "") as string}
      onChange={(e) => {
        const value = e.target.value;
        onChange(value);
      }}
    />
  );
};
