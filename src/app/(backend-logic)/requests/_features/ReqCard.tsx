"use client";
import {
  ClientRequestStatus,
  ClientRequestTypeDTO,
} from "@/app/(client-logic)/client/types";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  Spinner,
  Alert,
  Skeleton,
  Divider,
  CardHeader,
  Button,
  Tooltip,
} from "@nextui-org/react";
import React from "react";
import { getUserById } from "../../workflow/[slug]/week/[weekId]/trip/_api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReqItem } from "./Context";
import { setRequestStatus } from "../_api";
import { useToast } from "@/components/ui/use-toast";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { IoCopyOutline } from "react-icons/io5";
import { WhatsAppButton } from "@/components";

export const ReqFullInfoCard = () => {
  const { selectedReq: info } = useReqItem();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: [`${info.logist_id}`],
    queryFn: async () => await getUserById(info.logist_id),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: setRequestStatus,
    onSuccess: (data) => {
      switch (data[0].status) {
        case ClientRequestStatus.IN_REVIEW:
          toast({
            description: (
              <Alert
                color="success"
                title={`Вы приняли заявку №${info.id} в рассмотрение`}
              />
            ),
          });
          break;

        case ClientRequestStatus.REJECTED:
          toast({
            description: (
              <Alert
                color="warning"
                title={`Вы отклонили заявку №${info.id}`}
              />
            ),
          });
          break;

        default:
          break;
      }
    },
    onError: ({ message }) => {
      toast({
        description: <Alert color="error" title={message} />,
      });
    },
  });

  const [_, copy] = useCopyToClipboard();

  const copyPhoneNumber = () => {
    copy(info.phone_number);
    toast({
      description: `${info.phone_number} скопирован`,
    });
  };

  return (
    <Card shadow="none" className="border">
      <CardHeader>
        <div className="text-lg font-semibold">
          <span>Номер заявки: </span>
          <span>{info.id}</span>
        </div>
        <div className="flex gap-2 ml-4">
          <span>Статус: </span>

          <span>{info.status}</span>
        </div>
      </CardHeader>
      <Divider orientation="horizontal" />
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
          <Divider orientation="horizontal" />
          <div className="grid grid-cols-2">
            <div className="flex flex-col">
              <div className="flex  gap-2">
                <span className="text-gray-600">Откуда: </span>
                <span>{info.departure}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex gap-2">
                <span className="text-gray-600">Куда: </span>
                <span>{info.unloading_point.city}</span>
              </div>

              {info.unloading_point.withDelivery && (
                <div className="flex gap-2">
                  <span className="text-gray-600">С доставкой на адрес: </span>
                  <span>
                    {info.unloading_point.deliveryAddress ||
                      "Адрес не был указан"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <Divider orientation="horizontal" />
          <div className="flex flex-col">
            <div className="flex gap-2">
              <span className="text-gray-600">Комментарий от клиента: </span>
              <span>{info.comments}</span>
            </div>
            <div className="flex gap-2">
              <div
                className="flex gap-2 hover:!text-gray-500 cursor-pointer items-center"
                onClick={() => {
                  copyPhoneNumber();
                }}
              >
                <Tooltip content="Скопировать номер" showArrow>
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-600">Номер клиента: </span>
                    <span>{info.phone_number}</span>
                    <span className="mt-1">
                      <IoCopyOutline />
                    </span>
                  </div>
                </Tooltip>
              </div>

              <WhatsAppButton phoneNumber={info.phone_number} />
            </div>
          </div>
        </div>
      </CardBody>
      <Divider orientation="horizontal" />
      <CardFooter className="gap-2 flex flex-col w-full">
        {info.status == ClientRequestStatus.REJECTED && (
          <Alert
            color="danger"
            title={
              isLoading ? (
                <Spinner />
              ) : (
                <div className="flex gap-2">
                  <span>Эта заявка была ранее отклонена:</span>
                  <span>{`${data.firstName} ${data.lastName}`}</span>
                </div>
              )
            }
          />
        )}
        <div className="flex gap-8 justify-start w-full">
          <Button
            color="success"
            variant="ghost"
            onPress={() => {
              mutate({
                reqId: info.id,
                status: ClientRequestStatus.IN_REVIEW,
              });
            }}
            isLoading={isPending}
          >
            {/* temp solution TODO: make changes here */}
            {info.status == ClientRequestStatus.IN_REVIEW
              ? "Создать груз на основе заявки"
              : "Взять в рассмотрение"}
          </Button>
          {info.status !== ClientRequestStatus.REJECTED && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">
                Нашли ошибку в заполнении заявки?
              </span>
              <Button
                isLoading={isPending}
                color="danger"
                variant="light"
                onPress={() => {
                  mutate({
                    reqId: info.id,
                    status: ClientRequestStatus.REJECTED,
                  });
                }}
              >
                Отклонить заявку
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
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
      <span className="text-gray-500 text-sm">кем создана:</span>
      <Avatar src={data.avatar} alt={`SGM ${data.avatar} avatar`} />
      <div className="flex h-full flex-col">
        <span>{data.firstName}</span>
        <span>{data.lastName}</span>
      </div>
    </div>
  );
};
