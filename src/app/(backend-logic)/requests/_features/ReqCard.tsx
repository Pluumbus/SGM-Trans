"use client";
import { ClientRequestStatus } from "@/app/(client-logic)/client/types";
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
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addLeadToReview, setLeadStatus, setRequestStatus } from "../_api";
import { useToast } from "@/components/ui/use-toast";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { IoCopyOutline } from "react-icons/io5";
import { WhatsAppButton } from "@/components";
import { CargoModal } from "../../workflow/_feature";
import { CargoModalMode } from "../../workflow/_feature/AddCargoModal/CargoModal";
import { SelectTripModal } from "./SelectTripModal";
import { AdjustedRequestDTO } from "../types";
import { useLeadItem } from "./BitrixContext";

export const ReqFullInfoCard = () => {
  const { selectedLead: info, disclosure, tripDisclosure } = useLeadItem();
  const { toast } = useToast();

  const { mutate: addLead, isPending: AddLeadPenginx } = useMutation({
    mutationFn: addLeadToReview,
    onSuccess: (data) => {
      toast({
        description: (
          <Alert
            color="success"
            title={`Вы приняли заявку №${info.id} в рассмотрение`}
          />
        ),
      });
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: setLeadStatus,
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
    copy(info.phone?.value);
    toast({
      description: `${info.phone?.value} скопирован`,
    });
  };

  return (
    <>
      <Card shadow="none" className="border">
        <CardHeader>
          <div className="text-lg font-semibold flex justify-between w-full">
            <div>
              <span>Номер заявки: </span>
              <span>{info.id}</span>
            </div>
            <div>
              <span>Дата: </span>
              <span>{new Date(info.date_create).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4"></div>
        </CardHeader>
        <Divider orientation="horizontal" />
        <CardBody>
          <div className="pr-2 flex flex-col gap-2">
            <div className="flex justify-between ">
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 text-gray-600">
                  <span>{info.title}</span>
                </div>
              </div>

              {/* <UserInfo userId={info.user_id} /> */}
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Почта:</span>
                <span> {info.email?.value || "Отсутствует"}</span>
              </div>
              <div className="flex gap-2">
                <div
                  className="flex gap-2 hover:!text-gray-500 cursor-pointer"
                  onClick={() => {
                    copyPhoneNumber();
                  }}
                >
                  <Tooltip content="Скопировать номер" showArrow>
                    <div className="flex gap-2 items-center">
                      <span className="text-gray-600">Номер клиента: </span>
                      <span>{info.phone?.value}</span>
                      <span className="mt-1">
                        <IoCopyOutline />
                      </span>
                    </div>
                  </Tooltip>
                </div>

                <WhatsAppButton phoneNumber={info.phone.value} />
              </div>
            </div>
          </div>
        </CardBody>
        <Divider orientation="horizontal" />
        <CardFooter className="gap-2 flex flex-col w-full">
          {/* {info.status == ClientRequestStatus.REJECTED && (
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
          )} */}
          <div className="flex gap-8 justify-start w-full">
            <Button
              color="success"
              variant="ghost"
              onPress={() => {
                // if (info.status == ClientRequestStatus.IN_REVIEW) {
                tripDisclosure.onOpenChange();
                // }
                //  else {
                addLead({
                  lead: info,
                });
                // }
              }}
              isLoading={isPending}
            >
              {/* temp solution TODO: make changes here */}
              {/* {info.status == ClientRequestStatus.IN_REVIEW */}
              {/* ? "Создать груз на основе заявки" */}Создать груз на основе
              заявки
              {/* } */}
            </Button>
            <div className="flex gap-2 items-center">
              {/* <span className="text-sm text-gray-500">
                Нашли ошибку в заполнении заявки?
              </span> */}
              <Button
                isLoading={isPending}
                color="danger"
                variant="light"
                onPress={() => {
                  mutate({
                    leadId: Number(info.id),
                    status: ClientRequestStatus.REJECTED,
                  });
                }}
              >
                Отклонить заявку
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      <SelectTripModal disclosure={tripDisclosure} />
      <CargoModal
        tripDisclosure={tripDisclosure}
        disclosure={disclosure}
        // prefilledData={info as AdjustedRequestDTO}
        trip_id={info?.trip_id}
        mode={CargoModalMode.FROM_REQUEST}
      />
    </>
  );
};
