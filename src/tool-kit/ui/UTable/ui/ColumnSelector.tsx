"use client";

import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { IoSettingsOutline } from "react-icons/io5";

export const ColumnSelector = ({ tInstance }: any) => {
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
              isDisabled={tInstance.getIsAllColumnsVisible() ? true : false}
              isSelected={tInstance.getIsAllColumnsVisible()}
              onChange={tInstance.getToggleAllColumnsVisibilityHandler()}
            >
              Выбрать все
            </Checkbox>
          </DropdownItem>
          <DropdownItem>
            <div className="max-h-96 flex flex-col overflow-y-scroll overflow-x-hidden">
              {tInstance.getAllLeafColumns().map((column) => (
                <Checkbox
                  key={column.id}
                  color="default"
                  isDisabled={
                    tInstance.getVisibleLeafColumns().length == 1 &&
                    column.getIsVisible()
                  }
                  isSelected={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                >
                  {column.columnDef.header == ""
                    ? column.columnDef.id
                    : column.columnDef.header}
                </Checkbox>
              ))}
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
