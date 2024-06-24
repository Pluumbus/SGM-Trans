import { Button, Input } from "@nextui-org/react";
import { Table } from "@tanstack/react-table";
import { SelectRowsPerPage } from "./SelectRowsPerPage";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

interface UPaginationProps<T> {
  tInstance: Table<T>;
}

export const UPagination = <T,>({ tInstance }: UPaginationProps<T>) => {
  const handlePageChange = (e: any) => {
    if (Number(e.target.value) > tInstance.getPageCount()) {
      console.log("tInstance.getPageCount()", tInstance.getPageCount());
      console.log("e.target.value", e.target.value);

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
          className="border rounded p-1"
          onClick={() => tInstance.firstPage()}
          disabled={!tInstance.getCanPreviousPage()}
          isIconOnly
        >
          <MdKeyboardDoubleArrowLeft />
        </Button>
        <Button
          className="border rounded p-1"
          onClick={() => tInstance.previousPage()}
          disabled={!tInstance.getCanPreviousPage()}
          isIconOnly
        >
          <MdKeyboardArrowLeft />
        </Button>
        <Button
          className="border rounded p-1"
          onClick={() => tInstance.nextPage()}
          disabled={!tInstance.getCanNextPage()}
          isIconOnly
        >
          <MdKeyboardArrowRight />
        </Button>
        <Button
          className="border rounded p-1"
          onClick={() => tInstance.lastPage()}
          disabled={!tInstance.getCanNextPage()}
          isIconOnly
        >
          <MdKeyboardDoubleArrowRight />
        </Button>
      </div>
      <span className="flex items-center gap-2">
        <div>Page</div>
        <strong>
          {tInstance.getState().pagination.pageIndex + 1} of{" "}
          {tInstance.getPageCount().toLocaleString()}
        </strong>
      </span>
      <span className="flex items-center gap-2">
        <Input
          type="number"
          label="Go to page:"
          max={tInstance.getPageCount()}
          defaultValue={(
            tInstance.getState().pagination.pageIndex + 1
          ).toString()}
          onChange={handlePageChange}
          className="w-32 text-large"
        />
      </span>
      <div>
        <SelectRowsPerPage tInstance={tInstance} />
      </div>
    </div>
  );
};
