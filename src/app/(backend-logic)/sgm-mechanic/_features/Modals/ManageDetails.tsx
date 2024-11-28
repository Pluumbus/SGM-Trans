import { FormNumberInput } from "@/components";
import {
  CarDetailType,
  CarsType,
} from "@/lib/references/drivers/feature/types";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { addDetailToCar, updateDetailToCar } from "../../_api/supa.requests";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

type Props = {
  disclosure: UseDisclosureProps & { onOpenChange: () => void };
  car: CarsType;
  isUpdate?: boolean;
  detail?: CarDetailType;
};

export const ManageDetails = ({
  disclosure,
  car,
  isUpdate = false,
  detail,
}: Props) => {
  const { register, setValue, handleSubmit, reset, getValues } =
    useForm<CarDetailType>();
  const { toast } = useToast();

  const { mutate: addDetail } = useMutation({
    mutationFn: addDetailToCar,
    onSuccess: () => {
      toast({ title: "Деталь успешно добавлена" });
      disclosure.onOpenChange();
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не получилось добавить деталь" });
    },
  });

  const { mutate: updateDetail } = useMutation({
    mutationFn: updateDetailToCar,
    onSuccess: () => {
      toast({ title: "Деталь успешно обновлена" });
      disclosure.onOpenChange();
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не получилось обновить деталь" });
    },
  });

  useEffect(() => {
    if (isUpdate && detail) {
      console.log("detail", detail);

      reset(detail);
    }
  }, [isUpdate, detail, reset]);

  const onSubmit = (data: CarDetailType) => {
    if (isUpdate) {
      updateDetail({ car, updatedDetail: data });
    } else {
      addDetail({ car, newDetails: data });
    }
  };

  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="gap-2">
            <span className="font-normal">
              {isUpdate ? "Обновить деталь для" : "Добавить деталь в"}
            </span>
            <span>{car.car}</span>
          </ModalHeader>
          <Divider />
          <ModalBody>
            <Input
              {...register("name")}
              label="Наименование детали"
              defaultValue={detail?.name || ""}
            />
            <FormNumberInput
              name={"mileage_to_inform"}
              initValue={Number(getValues().mileage_to_inform)}
              setValue={setValue}
              inputProps={{
                label: "Через сколько км совершить следующую замену",
                defaultValue: detail?.mileage_to_inform || "",
              }}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <div className="flex gap-2 justify-end w-full">
              <Button
                color="danger"
                variant="light"
                onClick={() => {
                  disclosure.onClose();
                }}
              >
                Закрыть
              </Button>
              <Button color="success" variant="ghost" type="submit">
                {isUpdate ? "Обновить деталь" : "Добавить деталь"}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
