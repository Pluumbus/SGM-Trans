import { FilterFn } from "@tanstack/react-table";

export const customArrayFilter: FilterFn<any> = (
  row,
  columnId,
  filterValueObj,
) => {
  const { filterValue, filterBy } = filterValueObj || {};

  if (!filterValue || typeof filterValue !== "string") {
    return true;
  }

  const columnData = row.getValue(columnId);

  if (Array.isArray(columnData)) {
    return columnData.some((item) => {
      if (filterBy && Array.isArray(filterBy)) {
        return filterBy.some((field) => {
          const fieldValue = field
            .split(".")
            .reduce((acc, key) => acc?.[key], item);
          return fieldValue
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toString().toLowerCase());
        });
      }

      return item
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
