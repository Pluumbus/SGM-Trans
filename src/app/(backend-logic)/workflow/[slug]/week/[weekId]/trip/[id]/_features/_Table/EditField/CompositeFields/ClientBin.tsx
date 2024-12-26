import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import React, { ReactNode, useEffect } from "react";
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
  useDisclosure,
} from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";

type Type = CargoType["client_bin"];

export const ClientBin = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const SNT = "KZ-SNT-";
  const [values, setValues] = useCompositeStates<Type>(info);
  const checkEmptySNT = () =>
    values.snts.every((e) => e.trim() == SNT || e.trim() == "");

  const { onOpenChange, isOpen } = useDisclosure();

  useEffect(() => {
    if (isOpen && !values.snts.every((e) => e.startsWith(SNT))) {
      setValues((prev) => {
        const res = prev.snts.map((e) =>
          !e.startsWith(SNT) ? `KZ-SNT-${e}` : e,
        );

        return {
          ...prev,
          snts: res,
        };
      });
    }
  }, [isOpen]);

  const addSNT = () => {
    setValues((prev) => ({
      ...prev,
      snts: [...prev?.snts, "KZ-SNT-"],
    }));
  };

  const handleSntChange = (value: string, index: number) => {
    const updatedSnts = [...values.snts];
    updatedSnts[index] = value;

    setValues((prev) => ({
      ...prev,
      snts: updatedSnts,
    }));

    if (value.length >= 47 && index === values.snts.length - 1) {
      setValues((prev) => ({
        ...prev,
        snts: [...prev.snts, "KZ-SNT-"],
      }));
    }
  };

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
      <div className={`flex w-full items-end `}>
        <Textarea
          variant="underlined"
          ariz-label="Инфо клиента"
          className="w-3/4"
          value={values?.tempText}
          onChange={(e) => {
            setValues((prev) => ({
              ...prev,
              tempText: e.target.value || "",
            }));
          }}
        />
        {/* <div className="flex items-end"> */}
        <Button
          variant="ghost"
          className="min-h-[2.7rem] w-1/4"
          onClick={() => {
            onOpenChange();
          }}
        >
          <div className="flex flex-col h-full">
            <span>Редакт</span>
            <span>ировать</span>
          </div>
        </Button>
      </div>
      {/* </div> */}
      <div
        onClick={() => {
          copyXIN();
        }}
      >
        <div className="w-full flex gap-2 items-center p-2 hover:opacity-75">
          <span className="text-[0.7rem]">БИН / ИИН:</span>
          <span className="font-semibold">{values.xin}</span>
        </div>
        <Divider orientation="horizontal" className="col-span-2" />
      </div>
      {values.snts.length > 0 && values.snts[0] !== SNT && (
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
            {values.snts.map((e, i) => (
              <>
                {/* @TODO: В будущем сделать копировать в буфер по клику */}
                <Card
                  shadow="none"
                  className="w-full !overflow-visible pl-1 bg-transparent"
                  key={e + i}
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
              </>
            ))}
          </div>
        </ScrollShadow>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
            <div className="grid grid-cols-2 gap-4">
              <Textarea
                value={values?.snts[0]}
                label="SNT 1"
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
                    label={`SNT ${index + 2}`}
                    onChange={(e) => handleSntChange(e.target.value, index + 1)}
                    className="mb-2"
                  />
                ))}
            </div>
            {!values.snts.some((e) => e == "") && (
              <>
                <Divider />
                <Button
                  variant="faded"
                  color="success"
                  onClick={() => {
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
                onClick={() => {
                  onOpenChange();
                }}
              >
                Отмена
              </Button>
              <Button
                variant="flat"
                color="success"
                onClick={() => {
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
