"use client";
import { NextPage } from "next";
import { DataTable } from "./_statsTable/data-table";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <div className="flex justify-center text-xl">
        Статистика работы сотрудников
      </div>
      <DataTable />
    </div>
  );
};

export default Page;
