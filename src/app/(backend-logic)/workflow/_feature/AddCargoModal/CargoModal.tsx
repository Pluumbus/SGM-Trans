import {
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { CargoType } from "../types";
import { Body, Footer } from "./ModalParts";
import { useCargoMutation, useValdiateForm } from "./helpers";
import { addCargoOnSubmit } from "./helpers";
import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import { AdjustedRequestDTO } from "@/app/(backend-logic)/requests/types";
import { useEffect, useState } from "react";
import {
  getLocalTimeZone,
  now,
  parseDate,
  today,
} from "@internationalized/date";

export enum CargoModalMode {
  FROM_REQUEST = "FROM_REQUEST",
  FROM_TABLE = "FROM_TABLE",
}

type CargoModalPropsType = {
  disclosure: ReturnType<typeof useDisclosure>;
  tripDisclosure?: ReturnType<typeof useDisclosure>;
  mode?: CargoModalMode;
  trip_id?: number;
  prefilledData?: AdjustedRequestDTO | CargoType;
};

export const CargoModal = ({
  mode = CargoModalMode.FROM_TABLE,
  prefilledData,
  disclosure,
  tripDisclosure,
  trip_id,
}: CargoModalPropsType) => {
  const { isOpen, onOpenChange } = disclosure;
  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<CargoType>();

  const { mutate, isPending } = useCargoMutation(
    onOpenChange,
    reset,
    tripDisclosure
  );

  const validate = useValdiateForm();

  useEffect(() => {
    if (prefilledData && mode == CargoModalMode.FROM_REQUEST) {
      setValue("receipt_address", `Город ${prefilledData.departure}`, {
        shouldValidate: true,
      });
      setValue("unloading_point", prefilledData.unloading_point, {
        shouldValidate: true,
      });
      setValue("quantity", prefilledData.quantity, {
        shouldValidate: true,
      });
      setValue("cargo_name", prefilledData.cargo_name, {
        shouldValidate: true,
      });
      setValue("comments", prefilledData.comments, {
        shouldValidate: true,
      });
      setValue("volume", prefilledData.volume, {
        shouldValidate: true,
      });
      setValue("weight", prefilledData.weight, {
        shouldValidate: true,
      });
      setValue("request_id", prefilledData.id, {
        shouldValidate: true,
      });
    } else if (prefilledData && mode == CargoModalMode.FROM_TABLE) {
      setValue(
        "receipt_address",
        (prefilledData as CargoType).receipt_address || "Склад Москва",
        {
          shouldValidate: true,
        }
      );
      setValue("volume", prefilledData.volume, {
        shouldValidate: true,
      });
      setValue("weight", prefilledData.weight, {
        shouldValidate: true,
      });
      setValue("client_bin", prefilledData.client_bin, {
        shouldValidate: true,
      });
      setValue("unloading_point", prefilledData.unloading_point, {
        shouldValidate: true,
      });
      setValue("is_documents", prefilledData.is_documents, {
        shouldValidate: true,
      });
      setValue("comments", prefilledData.comments, {
        shouldValidate: true,
      });
      setValue("quantity", prefilledData.quantity, {
        shouldValidate: true,
      });
      setValue("status", prefilledData.status, {
        shouldValidate: true,
      });
      setValue("cargo_name", prefilledData.cargo_name, {
        shouldValidate: true,
      });
      setValue("wh_id", prefilledData.id, {
        shouldValidate: true,
      });
    }
  }, [prefilledData]);

  return (
    <>
      <Modal
        disableAnimation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        isDismissable={false}
      >
        <ModalContent>
          <form
            onSubmit={handleSubmit((data) => {
              validate(data) &&
                addCargoOnSubmit(
                  data,
                  mutate,
                  prefilledData?.trip_id || trip_id
                );
            })}
          >
            <ModalHeader>Добавить груз</ModalHeader>
            <Divider />
            <Body props={{ register, control, setValue, watch }} />
            <Divider />
            <Footer onOpenChangeCargo={onOpenChange} isPending={isPending} />
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
