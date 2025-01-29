import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useUpdateCargoContext } from "./Context";
import { getCargoAudit } from "./requests";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import { useFieldFocus } from "../Contexts";
import { Avatar, Divider, Input, ScrollShadow } from "@nextui-org/react";
import {
  amountDictionary,
  AuditCargosType,
  cargoTypeDictionary,
  clientBinDictionary,
  quantityDictionary,
  unloadingPointDictionary,
} from "./types";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { parseDate } from "@internationalized/date";

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

  console.log(filteredData);

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
        {filteredData
          ?.sort((a, b) => b.id - a.id)
          .filter((f) => f.changed_fields !== null)
          .map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-5 px-2  border border-gray-400   gap-2 divide-x divide-gray-400  "
            >
              {/* <span className="py-4 col-span-1 text-center flex justify-center items-center">
                Номер операции: <b>{e.id}</b>
              </span> */}
              <div className="flex justify-center items-center gap-2">
                <Avatar
                  src={users.find((el) => el.id == e.user_id)?.imageUrl}
                />

                <span className="py-4 ">
                  {users.find((el) => el.id == e.user_id)?.userName}
                </span>
              </div>

              <span className="py-4 text-center  flex justify-center items-center">
                {new Date(e.created_at).toLocaleString("RU-ru")}
              </span>
              <div className="flex justify-center col-span-3">
                <ScrollShadow className="py-4 h-40">
                  {e.changed_fields?.map((el) => {
                    switch (el) {
                      case "act_details":
                        return null;
                      case "(inserted)":
                        return <b>Груз создан</b>;
                      case "is_unpalletizing":
                        return <div>{BooleanDataCell(el, e)}</div>;
                      case "is_documents":
                        return <div>{BooleanDataCell(el, e)}</div>;
                      case "comments":
                        return <div>{CommentDataCell(el, e)}</div>;
                      case "client_bin":
                        return <div>{ClientDataCell(el, e)}</div>;
                      case "amount":
                        return <div>{AmountDataCell(el, e)}</div>;
                      case "unloading_point":
                        return <div>{UnloadingPointDataCell(el, e)}</div>;
                      case "quantity":
                        return <div>{QuantityDataCell(el, e)}</div>;
                      case "status":
                        return <div>{StatusDataCell(el, e)}</div>;
                      default:
                        return (
                          <div key={el}>
                            <div className="grid grid-cols-5 gap-4 px-4 py-2">
                              <span className="font-semibold border-r-1 ">
                                {cargoTypeDictionary[el]}:{" "}
                              </span>
                              <span className="col=span-2 border-r-1 px-2">
                                Было:{" "}
                                <b>
                                  {JSON.stringify(e.cargo.old[el], null, 2)}{" "}
                                </b>
                              </span>
                              <span className="col=span-2">
                                Стало:{" "}
                                <b>
                                  {JSON.stringify(e.cargo.new[el], null, 2)}
                                </b>
                              </span>
                            </div>
                            <Divider />
                          </div>
                        );
                    }
                    // if (el == "act_details") return null;
                    // if (el == "(inserted)") return <b>Груз создан</b>;
                    // return (
                    //   <div key={el}>
                    //     <div className="grid grid-cols-5 gap-4 px-4 py-2">
                    //       <span className="font-semibold border-r-1 ">
                    //         {cargoTypeDictionary[el]}:{" "}
                    //       </span>
                    //       <span className="col=span-2 border-r-1 px-2">
                    //         Было:{" "}
                    //         <b>{JSON.stringify(e.cargo.old[el], null, 2)} </b>
                    //         {/* <b>{e.cargo.old[el]} </b> */}
                    //       </span>
                    //       <span className="col=span-2">
                    //         Стало:{" "}
                    //         <b>{JSON.stringify(e.cargo.new[el], null, 2)}</b>
                    //         {/* <b>
                    //           {Object.values(e.cargo.new[el]).map(
                    //             (value: string, index) => (
                    //               <div key={index}>{index + " | " + value}</div>
                    //             )
                    //           )}
                    //         </b> */}
                    //       </span>
                    //     </div>
                    //     <Divider />
                    //   </div>
                    // );
                  })}
                </ScrollShadow>
              </div>
            </div>
          ))}
      </ScrollShadow>
    </div>
  );
};

const BooleanDataCell = (key: any, e: AuditCargosType) => {
  return (
    <div key={key}>
      <div className="grid grid-cols-5 gap-4 px-4 py-2">
        <span className="font-semibold border-r-1 ">
          {cargoTypeDictionary[key]}:{" "}
        </span>
        <span className="col=span-2 border-r-1 px-2">
          Было: <b>{e.cargo.old[key] ? "Да" : "Нет"} </b>
        </span>
        <span className="col=span-2">
          Стало: <b>{e.cargo.new[key] ? "Да" : "Нет"}</b>
        </span>
      </div>
      <Divider />
    </div>
  );
};

const CommentDataCell = (key: any, e: AuditCargosType) => {
  return (
    <div key={key}>
      <div className="grid grid-cols-5 gap-4 px-4 py-2">
        <span className="font-semibold border-r-1 ">
          {cargoTypeDictionary[key]}:{" "}
        </span>
        <span className="col=span-2 border-r-1 px-2">
          Было: <b>{e.cargo.old[key].replace(/\n/g, "")} </b>
        </span>
        <span className="col=span-2">
          Стало: <b>{e.cargo.new[key].replace(/\n/g, "")}</b>
        </span>
      </div>
      <Divider />
    </div>
  );
};

const ClientDataCell = (key: any, e: AuditCargosType) => {
  return (
    <div key={key}>
      <div className="grid grid-cols-5 gap-4 px-4 py-2">
        <span className="font-semibold border-r-1 ">
          {cargoTypeDictionary[key]}:
        </span>
        <span className="col=span-2 border-r-1 px-2">
          Было:
          <Divider orientation="horizontal" />
          <span>
            {Object.entries(e.cargo.old[key]).map(([key, value]) => (
              <div key={key}>
                <span>{clientBinDictionary[key]}:</span>{" "}
                <b>{Array.isArray(value) ? value.join(", ") : value}</b>
              </div>
            ))}
          </span>
        </span>
        <span className="col=span-2">
          Стало:
          <Divider orientation="horizontal" />
          <span>
            {Object.entries(e.cargo.new[key]).map(([key, value]) => (
              <div key={key}>
                <span>{clientBinDictionary[key]}:</span>{" "}
                <b>{Array.isArray(value) ? value.join(", ") : value}</b>
              </div>
            ))}
          </span>
        </span>
      </div>
      <Divider />
    </div>
  );
};

const AmountDataCell = (key: any, e: AuditCargosType) => {
  return (
    <div key={key}>
      <div className="grid grid-cols-5 gap-4 px-4 py-2">
        <span className="font-semibold border-r-1 ">
          {cargoTypeDictionary[key]}:
        </span>
        <span className="col=span-2 border-r-1 px-2">
          Было: <Divider orientation="horizontal" />
          <span className="font-semibold">
            {Object.entries(e.cargo.old[key]).map(([key, value]) => (
              <div key={key}>
                <span>{amountDictionary[key]}:</span>{" "}
                <b>{Array.isArray(value) ? value.join(", ") : value}</b>
              </div>
            ))}
          </span>
        </span>
        <span className="col=span-2">
          Стало: <Divider orientation="horizontal" />
          <span className=" font-semibold">
            {" "}
            {Object.entries(e.cargo.new[key]).map(([key, value]) => (
              <div key={key}>
                <span>{amountDictionary[key]}:</span>{" "}
                <b>{Array.isArray(value) ? value.join(", ") : value}</b>
              </div>
            ))}
          </span>
        </span>
      </div>
      <Divider />
    </div>
  );
};

const UnloadingPointDataCell = (key: any, e: AuditCargosType) => {
  return (
    <div key={key}>
      <div className="grid grid-cols-5 gap-4 px-4 py-2">
        <span className="font-semibold border-r-1 ">
          {cargoTypeDictionary[key]}:
        </span>
        <span className="col=span-2 border-r-1 px-2">
          Было: <Divider orientation="horizontal" />
          <span className="font-semibold">
            {Object.entries(e.cargo.old[key]).map(([key, value]) => (
              <div key={key}>
                <span>{unloadingPointDictionary[key]}:</span>{" "}
                <b>{Array.isArray(value) ? value.join(", ") : value}</b>
              </div>
            ))}
          </span>
        </span>
        <span className="col=span-2">
          Стало: <Divider orientation="horizontal" />
          <span className=" font-semibold">
            {" "}
            {Object.entries(e.cargo.new[key]).map(([key, value]) => (
              <div key={key}>
                <span>{unloadingPointDictionary[key]}:</span>{" "}
                <b>{Array.isArray(value) ? value.join(", ") : value}</b>
              </div>
            ))}
          </span>
        </span>
      </div>
      <Divider />
    </div>
  );
};

const QuantityDataCell = (key: any, e: AuditCargosType) => {
  return (
    <div key={key}>
      <div className="grid grid-cols-5 gap-4 px-4 py-2">
        <span className="font-semibold border-r-1 ">
          {cargoTypeDictionary[key]}:
        </span>
        <span className="col=span-2 border-r-1 px-2">
          Было: <Divider orientation="horizontal" />
          <span className="font-semibold">
            {Object.entries(e.cargo.old[key])
              .reverse()
              .map(([key, value]) => (
                <div key={key}>
                  <span>{quantityDictionary[key]}:</span>{" "}
                  <b>{Array.isArray(value) ? value.join(", ") : value}</b>
                </div>
              ))}
          </span>
        </span>
        <span className="col=span-2">
          Стало: <Divider orientation="horizontal" />
          <span className=" font-semibold">
            {" "}
            {Object.entries(e.cargo.new[key])
              .reverse()
              .map(([key, value]) => (
                <div key={key}>
                  <span>{quantityDictionary[key]}:</span>{" "}
                  <b>{Array.isArray(value) ? value.join(", ") : value}</b>
                </div>
              ))}
          </span>
        </span>
      </div>
      <Divider />
    </div>
  );
};

const StatusDataCell = (key: any, e: AuditCargosType) => {
  const date = new Date(e.cargo.new[key]);
  return (
    <div key={key}>
      <div className="grid grid-cols-5 gap-4 px-4 py-2">
        <span className="font-semibold border-r-1 ">
          {cargoTypeDictionary[key]}:{" "}
        </span>
        <span className="col=span-2 border-r-1 px-2">
          Было: <b>{e.cargo.old[key] ?? ""} </b>
        </span>
        <span className="col=span-2">
          Стало: <b>{date.toLocaleDateString()}</b>
        </span>
      </div>
      <Divider />
    </div>
  );
};
