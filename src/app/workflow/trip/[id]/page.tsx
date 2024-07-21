"use client";
import { NextPage } from "next";
import { UTable } from "@/tool-kit/ui";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { CargoType } from "../../_feature/types";
import { getBaseColumnsConfig } from "./Table/CargoTable.config";

import mockData from "./Table/mock.data";
import { createCargoStore } from "./_store";

const Page: NextPage = ({}) => {
  const { id } = useParams() as { id: string };
  const columns = useMemo(() => getBaseColumnsConfig(), []);
  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };

  const store = createCargoStore(id);
  const cargoData = store((state) => state.cargoData);
  const updateCargoArray = store((state) => state.updateCargoArray);

  useEffect(() => {
    const storedData = localStorage.getItem(`cargo-storage-${id}`);
    if (storedData) {
      updateCargoArray(JSON.parse(storedData));
    } else {
      updateCargoArray(mockData);
    }

    const unsubscribe = store.subscribe(
      (state) => state.cargoData,
      (cargoData) => {
        localStorage.setItem(`cargo-storage-${id}`, JSON.stringify(cargoData));
      }
    );

    return () => unsubscribe();
  }, [id, store, updateCargoArray]);

  return (
    <div>
      <div>
        <span>Номер рейса: {id}</span>
        <pre>{JSON.stringify(cargoData, null, 2)}</pre>
        <span className="mt-5"></span>
        <pre>
          {JSON.stringify(
            JSON.parse(localStorage.getItem(`cargo-storage-${id}`)),
            null,
            2
          )}
        </pre>
      </div>
      <UTable
        data={cargoData}
        columns={columns}
        name="Cargo Table"
        config={config}
      />
    </div>
  );
};

export default Page;
