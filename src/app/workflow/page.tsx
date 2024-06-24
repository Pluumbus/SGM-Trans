"use client";
import { UTable } from "@/tool-kit/ui";
import { NextPage } from "next";
import { useMemo } from "react";

import { UseTableConfig } from "@/tool-kit/ui/UTable/types";

import { Cargo } from "./_feature/types";
import { getBaseColumnsConfig } from "./_feature/Table/CargoTable.config";
import mockData from "./_feature/Table/mock.data";
import { WeekCard } from "./_feature/WeekCard";

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
    <div>
      <WeekCard />
      {/* <UTable
        data={mMockData}
        columns={columns}
        name="Cargo Table"
        config={config}
      /> */}
    </div>
  );
};

export default Page;
