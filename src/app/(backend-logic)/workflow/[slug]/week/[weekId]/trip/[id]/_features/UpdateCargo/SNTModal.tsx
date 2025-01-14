import {
  Modal,
  ModalContent,
  ModalHeader,
  Divider,
  ModalBody,
  ScrollShadow,
  Textarea,
  Button,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import { values } from "lodash";
import React from "react";
import { useUpdateCargoContext } from "./Context";
import {
  Control,
  FieldValues,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { register } from "module";

export const SNTModal = ({
  fields,
  append,
  remove,
  register,
}: {
  fields: Record<"id", string>[];
  append: UseFieldArrayAppend<CargoType, never>;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<CargoType>;
}) => {
  const { sntDisclosure } = useUpdateCargoContext();

  return (
    <Modal
      isOpen={sntDisclosure.isOpen}
      onOpenChange={sntDisclosure.onOpenChange}
    >
      <ModalContent>
        <ModalHeader>
          <span>Добавить SNT</span>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <div className="flex flex-col">
            {fields.length == 0 && (
              <Button
                className="border border-dashed"
                variant="ghost"
                onPress={() => append("KZ-SNT-")}
              >
                <FaPlus />
              </Button>
            )}
            <ScrollShadow className="h-[15rem] scrollbar-thin pr-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end w-full">
                  <Input
                    variant="underlined"
                    label={`SNT ${index + 1}`}
                    {...register(`client_bin.snts.${index}` as const)}
                  />

                  <Button
                    isIconOnly
                    className="border border-dashed"
                    variant="ghost"
                    onPress={() => remove(index)}
                  >
                    <FaMinus />
                  </Button>
                  {index == fields.length - 1 && (
                    <Button
                      isIconOnly
                      className="border border-dashed"
                      variant="ghost"
                      onPress={() => {
                        append("");
                      }}
                    >
                      <FaPlus />
                    </Button>
                  )}
                </div>
              ))}
            </ScrollShadow>
          </div>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              color="danger"
              onPress={() => {
                sntDisclosure.onOpenChange();
              }}
            >
              Отмена
            </Button>
            <Button
              variant="flat"
              color="success"
              onPress={() => {
                sntDisclosure.onOpenChange();
              }}
            >
              Сохранить
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
