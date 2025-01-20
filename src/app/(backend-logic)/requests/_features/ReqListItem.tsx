"use client";
import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import {
  Avatar,
  Card,
  CardBody,
  Spinner,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ReqModal } from "./ReqModal";
import { useReqItem } from "./Context";
import { AdjustedRequestDTO } from "../types";
import { FaArrowRight } from "react-icons/fa6";

export const ReqListItem = ({
  info,
}: {
  info: AdjustedRequestDTO | ClientRequestTypeDTO;
}) => {
  const disclosure = useDisclosure();
  const { setSelectedReq, selectedReq } = useReqItem();
  return (
    <div className="h-fit w-full">
      <Card
        isHoverable
        isPressable
        shadow="none"
        className={`border ${selectedReq?.id == info?.id && "bg-slate-200"} w-full`}
      >
        <CardBody
          onClick={() => {
            setSelectedReq(info);
          }}
        >
          <div className="pr-2 flex flex-col gap-2">
            <div className="grid grid-cols-6 gap-4">
              <div className="grid grid-cols-2 gap-2 items-center col-span-2">
                <div>
                  <span>{info.cargo_name}</span>
                  <Divider orientation="vertical" />
                </div>
                <div className="flex gap-2 text-gray-600">
                  <span>{info.volume} куб.</span>
                  <span>{info.weight} тонн</span>
                  <div className="flex gap-1">
                    <span>{info.quantity.value}</span>
                    <span>{info.quantity.type || "шт"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-8 justify-between col-span-3">
                <Divider orientation="vertical" />

                <div className="flex gap-2 justify-start w-full">
                  <div className="flex gap-2">
                    <span className="text-gray-600">Из:</span>
                    <span>{info.departure}</span>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <div className="flex gap-2">
                      <span className="text-gray-600">В:</span>
                      <span>{info.unloading_point.city}</span>
                    </div>
                    {info.unloading_point.withDelivery && (
                      <div className="flex gap-2">
                        <span className="text-gray-600">На адрес:</span>
                        <span>{info.unloading_point.deliveryAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Divider orientation="vertical" />
              </div>

              <UserInfo userId={info.user_id} />
            </div>
          </div>
        </CardBody>
      </Card>
      <ReqModal disclosure={disclosure} />
    </div>
  );
};

const UserInfo = ({ userId }: { userId: string }) => {
  // const { data, isLoading } = useQuery({
  //   queryKey: [`${userId}`],
  //   queryFn: async () => await getUserById(userId),
  // });
  // if (isLoading) {
  //   return <Spinner />;
  // }
  return (
    <div className="flex gap-2 items-center">
      {/* <Avatar src={data.avatar} alt={`SGM ${data.avatar} avatar`} />
      <div className="flex h-full flex-col ">
        <span>{data.firstName}</span>
        <span>{data.lastName}</span>
      </div> */}
    </div>
  );
};
