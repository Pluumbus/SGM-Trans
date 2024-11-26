import { FilterFn } from "@tanstack/react-table";

export const customFilter: FilterFn<any> = (row, columnId, filterValueObj) => {
  const { filterValue, filterBy } = filterValueObj || {};

  if (!filterValue || typeof filterValue !== "string") {
    return true;
  }

  if (filterBy && Array.isArray(filterBy)) {
    return filterBy.some((field) => {
      const fieldValue = field
        .split(".")
        .reduce((acc, key) => acc?.[key], row.original);
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toString().toLowerCase());
    });
  }

  const cellValue = row.getValue(columnId);
  return cellValue
    ?.toString()
    .toLowerCase()
    .includes(filterValue.toString().toLowerCase());
};
