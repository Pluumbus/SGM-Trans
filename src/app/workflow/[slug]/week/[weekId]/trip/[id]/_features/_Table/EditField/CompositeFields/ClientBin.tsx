import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode, useEffect, useState } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";

type Type = CargoType["client_bin"];

export const ClientBin = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);

  const { onOpenChange, isOpen } = useDisclosure();

  useEffect(() => {
    return () => {
      if (!isOpen && values.snts.some((e) => e == "")) {
        const vals = values.snts.filter((e) => e != "");
        setValues((prev) => ({
          ...prev,
          snts: vals,
        }));
      }
    };
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

    if (value.length >= 10 && index === values.snts.length - 1) {
      setValues((prev) => ({
        ...prev,
        snts: [...prev.snts, "KZ-SNT-"],
      }));
    }
  };
  return (
    <>
      <div className="min-w-[15rem] grid grid-cols-2 h-full gap-y-2">
        <Textarea
          variant="underlined"
          ariz-label="Инфо клиента"
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
          className="min-h-[2.7rem]"
          onClick={() => {
            onOpenChange();
          }}
        >
          <div className="flex flex-col h-full">
            <span>Добавить</span>
            <span>SNT</span>
          </div>
        </Button>
        {/* </div> */}

        {values.snts.map((e) => (
          <div className="">
            <span>{e},</span>
          </div>
        ))}
      </div>
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
    </>
  );
};
