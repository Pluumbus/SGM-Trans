"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ClientRequestType } from "../../types";
import { getClientRequests } from "../../_features/api";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";
import { FaCheckDouble } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa";
import truck from "@/app/_imgs/truck.gif";
import Image from "next/image";

export const RequestsList = () => {
  const [requests, setRequests] = useState<ClientRequestType[]>([]);
  const { mutate } = useMutation({
    mutationFn: getClientRequests,
    onSuccess: (data: ClientRequestType[]) => {
      setRequests(data);
    },
  });
  useEffect(() => {
    mutate();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {requests.map((e) => (
        <RequestCard reqInfo={e} />
      ))}
    </div>
  );
};

const RequestCard = ({ reqInfo }: { reqInfo: ClientRequestType }) => {
  return (
    <Card isHoverable isPressable>
      <CardHeader>
        <div className="flex">
          <span className="font-semibold">
            <ReqStatus reqStatus={reqInfo.status} />
          </span>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-3 items-center gap-2">
          <span>
            Из&nbsp;<span className="font-semibold">{reqInfo.departure}</span>
          </span>
          <ReqCar />
          <span className="justify-self-end">
            В&nbsp;
            <span className="font-semibold">
              {reqInfo.unloading_point.city}
            </span>
          </span>
        </div>

        <div>
          <span>
            Везем:<span className="font-semibold"> {reqInfo.cargo_name}</span>
          </span>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col gap-4">
        <div className="grid grid-cols-5 gap-2 font-semibold items-center justify-items-center">
          <span>{reqInfo.volume} м3</span>
          <Divider orientation="vertical" className="h-full w-[1px]" />
          <span>{reqInfo.weight} тонн</span>
          <Divider orientation="vertical" className="h-full w-[1px]" />
          <span>{reqInfo.quantity.value} шт.</span>
        </div>
        <div className="flex w-full justify-end text-gray-400">
          <span>{new Date(reqInfo.created_at).toLocaleDateString("RU")}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const ReqCar = () => {
  return (
    <div>
      <Image src={truck} width={34} alt="sgm-truck" />
      <Divider className="justify-self-center" />
    </div>
  );
};

const ReqStatus = ({
  reqStatus,
}: {
  reqStatus: ClientRequestType["status"];
}) => {
  switch (reqStatus) {
    case "Создана":
      return (
        <div className="text-success-700 flex gap-2 items-center">
          <span>{reqStatus}</span>
          <FaCheck />
        </div>
      );
    case "В рассмотрении логистом":
      return (
        <div className="text-warning-600 flex gap-2 items-center">
          <span>{reqStatus}</span>
          <FaUserCheck />
        </div>
      );
    case "Заявка одобрена":
      return (
        <div className="text-success-500 flex gap-2 items-center">
          <span>{reqStatus}</span>
          <FaCheckDouble />
        </div>
      );

    case "Заявка отклонена":
      return (
        <div className="text-danger-700 flex gap-2 items-center">
          <span>{reqStatus}</span>
          <FaXmark />
        </div>
      );

    default:
      return <span>{reqStatus}</span>;
  }
};
