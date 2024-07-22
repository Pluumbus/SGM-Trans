"use client";

import { UTable } from "@/tool-kit/ui";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getBaseColumnsConfig } from "./_Table/CargoTable.config";
import { CargoType } from "@/app/workflow/_feature/types";
import { useQuery } from "@tanstack/react-query";
import { getCargos } from "../../_api";
import { Button, useDisclosure } from "@nextui-org/react";
import { CargoModal } from "@/app/workflow/_feature";
import supabase from "@/utils/supabase/client";

export const WorkflowPage = () => {
  const { id } = useParams() as { id: string };
  const columns = useMemo(() => getBaseColumnsConfig(), []);
  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };

  const { data } = useQuery<any, CargoType[]>({
    queryKey: ["cargos"],
    queryFn: async () => await getCargos(),
  });

  const [cargos, setCargos] = useState<CargoType[]>(data || []);

  useEffect(() => {
    const cn = supabase
      .channel(`workflow/trip/${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cargos",
          filter: `trip_id=eq.${id}`,
        },
        (payload) => {
          setCargos((prev) => [...prev, payload.new as CargoType]);
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  });

  const { isOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <div className="flex flex-col gap-2">
        <span>Номер рейса: {id}</span>
        <div>
          <Button onClick={onOpenChange}>Добавить груз</Button>
        </div>
      </div>
      <UTable
        data={cargos}
        columns={columns}
        name="Cargo Table"
        config={config}
      />
      <CargoModal
        isOpenCargo={isOpen}
        onOpenChangeCargo={onOpenChange}
        trip_id={id}
      />
    </div>
  );
};
