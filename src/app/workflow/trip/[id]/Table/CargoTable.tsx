import { getBaseColumnsConfig } from "./CargoTable.config";

const tableCols = [
  "created_at",
  "receipt_address",
  "unloading_city",
  "weight",
  "volume",
  "quantity",
  "driver",
  "amount",
  "is_unpalletizing",
];

export const getCargoTableCfg = () => {
  const fmCols = getBaseColumnsConfig().filter((column) =>
    tableCols.includes(column.accessorKey)
  );
  return fmCols;
};
