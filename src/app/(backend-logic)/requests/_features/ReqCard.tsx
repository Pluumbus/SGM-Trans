"use client";
import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  Spinner,
  Alert,
  Skeleton,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { getUserById } from "../../workflow/[slug]/week/[weekId]/trip/_api";
import { useQuery } from "@tanstack/react-query";
import { ReqModal } from "./ReqModal";

export const ReqCard = ({ info }: { info: ClientRequestTypeDTO }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <Card isHoverable shadow="none" className="border">
        <CardBody>
          <div className="pr-2 flex flex-col gap-2">
            <div className="flex justify-between ">
              <div className="flex gap-2 items-center">
                <span>{info.cargo_name}</span>
                <Divider orientation="vertical" />
                <div className="flex gap-2 text-gray-600">
                  <span>{info.volume} куб.</span>
                  <span>{info.weight} тонн</span>
                  <div className="flex gap-1">
                    <span>{info.quantity.value}</span>
                    <span>{info.quantity.type || "шт"}</span>
                  </div>
                </div>
              </div>

              <UserInfo userId={info.user_id} />
            </div>
            {/* <Divider orientation="horizontal" />
            <div className="grid grid-cols-2">
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <span className="text-gray-600">Куда: </span>
                  <span>{info.unloading_point.city}</span>
                </div>

                {info.unloading_point.withDelivery && (
                  <div className="flex gap-2">
                    <span className="text-gray-600">
                      С доставкой на адрес:{" "}
                    </span>
                    <span>
                      {info.unloading_point.deliveryAddress ||
                        "Адрес не был указан"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex justify-end gap-2">
                  <span className="text-gray-600">Откуда: </span>
                  <span>{info.departure}</span>
                </div>
              </div>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex flex-col">
              <div className="flex gap-2">
                <span className="text-gray-600">Груз: </span>
                <span>{info.cargo_name}</span>
              </div>
            </div> */}
          </div>
        </CardBody>
        {/* <CardFooter>
          <Alert
            color={info.status == "Создана" ? "warning" : "success"}
            title={<Status logistId={info.logist_id} />}
          />
        </CardFooter> */}
      </Card>
      <ReqModal disclosure={disclosure} />
    </>
  );
};

const Status = ({ logistId }: { logistId: string }) => {
  if (logistId !== "") {
    const { data, isLoading } = useQuery({
      queryKey: [`${logistId}`],
      queryFn: async () => await getUserById(logistId),
    });

    if (isLoading) {
      return <Skeleton className="w-[40px] h-[16px]" />;
    }
    return <span>В рассмотрении {data.firstName}</span>;
  } else return <span>Создана клиентом</span>;
};

const UserInfo = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: [`${userId}`],
    queryFn: async () => await getUserById(userId),
  });
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="flex gap-2 items-center">
      <Avatar src={data.avatar} alt={`SGM ${data.avatar} avatar`} />
      <div className="flex h-full flex-col">
        <span>{data.firstName}</span>
        <span>{data.lastName}</span>
      </div>
    </div>
  );
};
