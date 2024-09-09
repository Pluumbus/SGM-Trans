import { Button, Divider, Input } from "@nextui-org/react";
import { Table } from "@tanstack/react-table";
import { SelectRowsPerPage } from "./SelectRowsPerPage";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

interface UPaginationProps<T> {
  tInstance: Table<T>;
  isPagiantion: boolean;
}

export const UPagination = <T,>({
  tInstance,
  isPagiantion,
}: UPaginationProps<T>) => {
  const handlePageChange = (e: any) => {
    if (Number(e.target.value) > tInstance.getPageCount()) {
      const page = e.target.value ? Number(tInstance.getPageCount()) - 1 : 0;
      tInstance.setPageIndex(page);
    } else {
      const page = e.target.value ? Number(e.target.value) - 1 : 0;
      tInstance.setPageIndex(page);
    }
  };
  return (
    <div className="flex items-center gap-4 justify-center my-4">
      <div className="flex gap-2">
        <Button
          onClick={() => tInstance.firstPage()}
          disabled={!tInstance.getCanPreviousPage()}
          isIconOnly
        >
          <MdKeyboardDoubleArrowLeft />
        </Button>
        <Button
          onClick={() => tInstance.previousPage()}
          disabled={!tInstance.getCanPreviousPage()}
          isIconOnly
        >
          <MdKeyboardArrowLeft />
        </Button>
        <Button
          onClick={() => tInstance.nextPage()}
          disabled={!tInstance.getCanNextPage()}
          isIconOnly
        >
          <MdKeyboardArrowRight />
        </Button>
        <Button
          onClick={() => tInstance.lastPage()}
          disabled={!tInstance.getCanNextPage()}
          isIconOnly
        >
          <MdKeyboardDoubleArrowRight />
        </Button>
      </div>
      <Divider orientation="vertical" className="h-5" />
      <span className="flex items-center gap-2">
        <div>Страница:</div>
        <strong>
          {tInstance.getState().pagination.pageIndex + 1} of{" "}
          {tInstance.getPageCount().toLocaleString()}
        </strong>
      </span>
      <Divider orientation="vertical" className="h-5" />
      <span className="flex items-center gap-2">
        <span>Перейти на страницу: </span>
        <Input
          type="number"
          max={tInstance.getPageCount()}
          defaultValue={(
            tInstance.getState().pagination.pageIndex + 1
          ).toString()}
          onChange={handlePageChange}
          className="w-32 text-large"
        />
      </span>
      <Divider orientation="vertical" className="h-5" />
      <div>
        <SelectRowsPerPage tInstance={tInstance} />
      </div>
    </div>
  );
};
