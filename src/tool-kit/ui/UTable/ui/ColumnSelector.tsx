"use client";

import React, { useEffect, useId } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Table } from "@tanstack/react-table";
import { IoSettingsOutline } from "react-icons/io5";

export const ColumnSelector = <T,>({
  tInstance,
  name,
}: {
  tInstance: Table<T>;
  name: string;
}) => {
  const id = useId();
  useEffect(() => {
    const storedVisibility = localStorage.getItem(
      `myTableColumnVisibility-${name}`
    );
    console.log(storedVisibility);
    console.log(!!storedVisibility);

    if (Object.keys(storedVisibility || {}).length > 2) {
      tInstance.setColumnVisibility(JSON.parse(storedVisibility));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      `myTableColumnVisibility-${name}`,
      JSON.stringify(tInstance.getState().columnVisibility)
    );
  }, [tInstance.getState().columnVisibility]);

  return (
    <div className="flex gap-4 capitalize justify-end">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" isIconOnly>
            <IoSettingsOutline className="text-xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Column selector"
          variant="flat"
          closeOnSelect={false}
        >
          <DropdownItem key="Toggle All">
            <Checkbox
              color="default"
              isDisabled={tInstance.getIsAllColumnsVisible()}
              isSelected={tInstance.getIsAllColumnsVisible()}
              onChange={tInstance.getToggleAllColumnsVisibilityHandler()}
            >
              Выбрать все
            </Checkbox>
          </DropdownItem>

          <DropdownItem key="Toggle each">
            <div className="max-h-96 flex flex-col overflow-y-scroll overflow-x-hidden">
              {tInstance.getAllLeafColumns().map((column) => {
                return (
                  <Checkbox
                    key={column.id}
                    color="default"
                    isDisabled={
                      tInstance.getVisibleLeafColumns().length === 1 &&
                      column.getIsVisible()
                    }
                    isSelected={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  >
                    <span>
                      {/* @ts-ignore */}
                      {column.columnDef.header ||
                        column.columnDef.id ||
                        column.columnDef.accessorKey}
                    </span>
                  </Checkbox>
                );
              })}
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
