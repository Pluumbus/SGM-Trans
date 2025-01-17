import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode, useEffect, useState } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import { FaPlus, FaUpload } from "react-icons/fa6";

type Type = CargoType["client_bin"];

export const ClientBin = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const SNT = "KZ-SNT-";

  const values: CargoType["client_bin"] = info.getValue();

  const checkEmptySNT = () =>
    values?.snts?.every((e) => e.trim() == SNT || e.trim() == "");

  const { onOpenChange, isOpen } = useDisclosure();

  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const { toast } = useToast();

  const copyXIN = () => {
    copyToClipboard(values.xin);
    toast({
      title: "Скопировано в буфер обмена",
      description: `${values.xin} БИН скопирован`,
    });
  };
  const copySnts = () => {
    if (!checkEmptySNT()) {
      copyToClipboard(values.snts.join("\n"));
      toast({
        title: "Скопировано в буфер обмена",
        description: `${values.snts.length} SNT скопировано`,
      });
    } else {
      toast({
        title: "Ничего не было скопировано",
        description: `Добавьте SNT чтобы их копировать`,
      });
    }
  };

  return (
    <div className={`${checkEmptySNT() && "bg-red-100"} px-2 min-w-[15rem]`}>
      <div className={`flex w-full items-end`}>
        <b className=" flex mb-10 w-full">{values?.tempText}</b>

        <div className="flex flex-col">
          <Tooltip
            content={
              <span>
                <span className="font-semibold">Загрузить</span>{" "}
                <span className="font-semibold">СНТ</span>
              </span>
            }
            showArrow
          >
            {/* <Button
              variant="flat"
              color="success"
              
              isIconOnly
            >
              <FaUpload />
            </Button> */}
          </Tooltip>
          <Button
            variant="light"
            isDisabled
            onPress={() => {
              // onOpenChange();
            }}
            isIconOnly
          >
            <FaPlus />
          </Button>
        </div>
      </div>

      <div
        onClick={() => {
          copyXIN();
        }}
      >
        <div className="w-full flex gap-2 items-center p-2 hover:opacity-75">
          <span className="text-[0.7rem]">БИН / ИИН:</span>
          <span className="font-semibold">{values?.xin}</span>
        </div>
        <Divider orientation="horizontal" className="col-span-2" />
      </div>
      {values?.snts?.length > 0 && values?.snts[0] !== SNT && (
        <ScrollShadow
          className="w-full max-h-[150px]"
          hideScrollBar
          offset={10}
        >
          <div
            className=" grid grid-cols-2 h-full overflow-visible gap-y-2 mt-1 pb-4 hover:opacity-75"
            onClick={() => {
              copySnts();
            }}
          >
            {values?.snts.map((e, i) => (
              <div key={e + i}>
                <Card
                  shadow="none"
                  className="w-full !overflow-visible pl-1 bg-transparent"
                >
                  <CardBody className="w-full h-full p-0 !overflow-visible">
                    <div className="flex w-full justify-between h-full">
                      <span
                        className={`w-full ${i % 2 == 0 ? "pr-2" : "pl-2"}`}
                      >
                        {e}
                      </span>
                      {i % 2 == 0 && (
                        <div className="h-full col-span-1">
                          <Divider orientation="vertical" />
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
                {i % 2 !== 0 && (
                  <Divider orientation="horizontal" className="col-span-2" />
                )}
              </div>
            ))}
          </div>
        </ScrollShadow>
      )}

      <Modal
      // isOpen={isOpen} onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader>
            <span>Добавить SNT и БИН/ИИН клиента</span>
          </ModalHeader>
          <Divider />
          <ModalBody>
            <Input
              value={values?.xin}
              label="БИН/ИИН"
              onChange={(e) => {
                setValues((prev) => ({
                  ...prev,
                  xin: e.target.value,
                }));
              }}
            />
            {/* <div className="grid grid-cols-2 gap-4"> */}
            <div className="flex flex-col">
              <ScrollShadow className="h-[20rem]">
                <Textarea
                  value={values?.snts && values.snts[0]}
                  label="СНТ 1"
                  onChange={(e) => {
                    handleSntChange(e.target.value, 0);
                  }}
                  className="mb-2"
                />
                {values?.snts
                  ?.slice(1)
                  .map((snt, index) => (
                    <Textarea
                      key={index}
                      value={snt}
                      label={`СНТ ${index + 2}`}
                      onChange={(e) =>
                        handleSntChange(e.target.value, index + 1)
                      }
                      className="mb-2"
                    />
                  ))}
              </ScrollShadow>
            </div>
            {!values?.snts?.some((e) => e == "") && (
              <>
                <Divider />
                <Button
                  variant="faded"
                  color="success"
                  onPress={() => {
                    addSNT();
                  }}
                >
                  Добавить поле для SNT
                </Button>
              </>
            )}
            <Divider />
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                color="danger"
                onPress={() => {
                  onOpenChange();
                }}
              >
                Отмена
              </Button>
              <Button
                variant="flat"
                color="success"
                onPress={() => {
                  onOpenChange();
                }}
              >
                Сохранить
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
