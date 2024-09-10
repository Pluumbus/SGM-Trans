/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
} from "@nextui-org/react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React, { useState } from "react";
import { Input, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getUserList } from "../_api/requests";
import { columns } from "./columns";
import { roleNamesList } from "@/lib/references/roles/roles";

export function DataTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["Get users for admin panel"],
    queryFn: async () => await getUserList(),
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  if (isLoading) {
    return (
      <div className="flex justify-center mt-60">
        <Spinner />
      </div>
    );
  }

  const handleCheckBox = () => {
    const [checkRole, setCheckRole] = useState(false);

    table.getColumn("role")?.setFilterValue(roleNamesList);
  };
  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Поиск по почте"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-xs w-2/4 max-h-1 mt-10"
        />
        <Autocomplete
          label="Поиск по роли"
          className="max-w-xs w-2/4 max-h-1 ml-5 mb-9"
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
          onInputChange={(event) =>
            table.getColumn("role")?.setFilterValue(event)
          }
        >
          {roleNamesList.map((role: string) => (
            <AutocompleteItem key={role}>{role}</AutocompleteItem>
          ))}
        </Autocomplete>
        <Checkbox className="ml-5" onClick={handleCheckBox} />

        <p>Только с ролью</p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Таблица пуста
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-1">
          <div>
            <Button
              variant="light"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeftIcon />
            </Button>
          </div>
          <div>
            <Button
              variant="light"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
