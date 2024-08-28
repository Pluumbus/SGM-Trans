"use client";

import { UTable } from "@/tool-kit/ui";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getBaseColumnsConfig } from "./_features/_Table/CargoTable.config";
import { CargoType } from "@/app/workflow/_feature/types";
import { useQuery } from "@tanstack/react-query";
import { getCargos } from "../_api";
import { Button, useDisclosure } from "@nextui-org/react";
import { CargoModal } from "@/app/workflow/_feature";
import supabase from "@/utils/supabase/client";
import { NextPage } from "next";
import { Timer } from "@/components/timeRecord/timeRecord";
import RoleBasedRedirect from "@/components/roles/RoleBasedRedirect";
import { useUser } from "@clerk/nextjs";

const Page: NextPage = () => {
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
  const [showTimer, setShowTimer] = useState(false);
  const { user, isLoaded } = useUser();
  const handleToggleTimer = () => {
    setShowTimer((prevShowTimer) => !prevShowTimer);
  };
  const handleStopTimer = () => {
    setShowTimer(false);
  };
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <span>Номер рейса: {id}</span>
          <div>
            <Button onClick={onOpenChange}>Добавить груз</Button>
          </div>
        </div>
        <RoleBasedRedirect allowedRoles={["Админ", "Логист Дистант"]}>
          {showTimer ? (
            <Timer onStop={handleStopTimer} />
          ) : (
            <Button color="primary" onClick={handleToggleTimer}>
              {isLoaded && (user!.publicMetadata?.time as number) != 0
                ? "Продолжить работу"
                : "Начать работу"}
            </Button>
          )}
        </RoleBasedRedirect>
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

export default Page;

// "use client";
// import { NextPage } from "next";
// import { UTable } from "@/tool-kit/ui";
// import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
// import { useParams } from "next/navigation";
// import { useMemo } from "react";
// import { CargoType } from "../../_feature/types";
// import { getBaseColumnsConfig } from "./_features/_Table/CargoTable.config";
// import mockData from "./_features/_Table/mock.data";
// import { WorkflowPage } from "./_features/Page";

// const Page: NextPage = ({}) => {
//   const columns = useMemo(() => getBaseColumnsConfig(), []);
//   const config: UseTableConfig<CargoType> = {
//     row: {
//       setRowData(info) {},
//       className: "cursor-pointer",
//     },
//   };

//   const mMockData = useMemo(() => {
//     return mockData;
//   }, []);
//   const { id } = useParams();

//   return (
//     <div>
//       {/* <div>
//         <span>Номер рейса: {id}</span>
//       </div>
//       <UTable
//         data={mMockData}
//         columns={columns}
//         name="Cargo Table"
//         config={config}
//       /> */}
//       <WorkflowPage/>
//     </div>
//   );
// };

// export default Page;
