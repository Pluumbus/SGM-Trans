"use client";
import { UTable } from "@/tool-kit/ui";
import { NextPage } from "next";
import { useMemo } from "react";
import { getBaseColumnsConfig } from "./_feature/CargoTable.config";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import mockData from "./_feature/mock.data";
import { Cargo } from "./_feature/types";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const columns = useMemo(() => getBaseColumnsConfig(), []);
  const config: UseTableConfig<Cargo> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };

  const mMockData = useMemo(() => {
    return mockData;
  }, []);

  return (
    <UTable
      data={mMockData}
      columns={columns}
      name="Cargo Table"
      config={config}
    />
  );
};

export default Page;
