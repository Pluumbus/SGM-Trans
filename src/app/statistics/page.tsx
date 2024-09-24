"use client";
import { NextPage } from "next";
import { DataTable } from "./_statsTable/data-table";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <DataTable />
    </div>
  );
};

export default Page;
