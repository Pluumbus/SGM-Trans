"use client";
import { UTable } from "@/tool-kit/ui";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { getBaseColumnsConfig } from "./Table/CargoTable.config";
import { Cargo } from "../../_feature/types";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import mockData from "./Table/mock.data";

const Page: NextPage = ({}) => {
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
  const { id } = useParams();
  return (
    <div>
      <div>
        <span>Номер рейса: {id}</span>
      </div>
      <UTable
        data={mMockData}
        columns={columns}
        name="Cargo Table"
        config={config}
      />
    </div>
  );
};

export default Page;
