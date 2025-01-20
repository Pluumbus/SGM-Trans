import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useUpdateCargoContext } from "./Context";
import { getCargoAudit } from "./requests";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import { useFieldFocus } from "../Contexts";
import { Divider, Input, ScrollShadow } from "@nextui-org/react";
import { AuditCargosType } from "./types";

export const Audit = () => {
  const { row } = useUpdateCargoContext();
  const [_, setFieldToFocusOn] = useFieldFocus();
  const [filteredData, setFilteredData] = useState<AuditCargosType[]>([]);

  useEffect(() => {
    setFieldToFocusOn(null);
  }, []);
  const { data, isLoading } = useQuery({
    queryKey: [`GetLogs${row.id}`],
    queryFn: async () => await getCargoAudit(row.id),
    enabled: !!row.id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["getUsersList"],
    queryFn: async () => await getUserList(),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const [filter, setFiilter] = useState<string>("");
  const filterByFields = (field: string) => {
    const res = data.filter((e) =>
      e.changed_fields.some((el) => el.includes(field))
    );
    setFilteredData(res);
  };

  if (isLoading || isLoadingUsers) {
    return <SgmSpinner />;
  }
  return (
    <div>
      <Input
        label="Поиск по наименованию поля"
        variant="underlined"
        value={filter}
        onChange={(e) => {
          setFiilter(e.target.value);
          filterByFields(e.target.value);
        }}
      />
      <ScrollShadow className="h-[35rem]">
        {filteredData.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-6 px-2  border  border-black  gap-2 divide-x divide-black"
          >
            <span className="py-4 col-span-1 text-center">
              Номер операции: <b>{e.id}</b>
            </span>
            <span className="py-4 text-center">
              {users && users.find((el) => el.id == e.user_id)?.userName}
            </span>
            <span className="py-4 text-center">
              {new Date(e.created_at).toLocaleString("RU-ru")}
            </span>
            <div className="flex justify-center col-span-3">
              <ScrollShadow className="py-4 h-40">
                {e.changed_fields.map((el) => {
                  if (el == "act_details") return null;

                  return (
                    <div key={el}>
                      <div className="grid grid-cols-5 gap-4 px-4 py-2">
                        <span className="font-semibold border-r-1 ">
                          "{el}":{" "}
                        </span>
                        <span className="col=span-2 border-r-1 px-2">
                          Было:{" "}
                          <b>{JSON.stringify(e.cargo.old[el], null, 2)}</b>
                        </span>
                        <span className="col=span-2">
                          Стало:{" "}
                          <b>{JSON.stringify(e.cargo.new[el], null, 2)}</b>
                        </span>
                      </div>
                      <Divider />
                    </div>
                  );
                })}
              </ScrollShadow>
            </div>
          </div>
        ))}
      </ScrollShadow>
    </div>
  );
};
