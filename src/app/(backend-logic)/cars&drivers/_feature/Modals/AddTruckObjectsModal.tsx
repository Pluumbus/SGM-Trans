import { toast } from "@/components/ui/use-toast";
import { useConfirmContext } from "@/tool-kit/hooks";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import {
  deleteObj,
  setCar,
  setCarGazell,
  setDriver,
  setTrailer,
} from "../../_api/requests";
import { useState } from "react";

export const AddTruckObjectsModal = ({
  modalTitle,
  isOpen,
  onOpenChange,
}: {
  modalTitle: string;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const [mutateObj, setMutateObj] = useState({
    name: "",
    state_number: "",
    driver_name: "",
    passport_number: "",
    passport_date: "",
    passport_issued: "",
  });

  const { mutate } = useMutation({
    mutationFn: async (type: string) => {
      return type == ModalTitleItems[0]
        ? await setDriver(mutateObj.name)
        : type == ModalTitleItems[1]
          ? await setCar(mutateObj)
          : type == ModalTitleItems[2]
            ? await setTrailer(mutateObj)
            : await setCarGazell(mutateObj);
    },
    onSuccess: () => {
      toast({ title: "Успешно добавлен(а)" });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Объект уже есть в списке" });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMutateObj((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">
                {modalTitle}
              </ModalHeader>
              <ModalBody>
                {modalTitle == ModalTitleItems[0] && (
                  <div>
                    <p>Введите Ф.И.О. водителя</p>
                    <Input
                      name="name"
                      variant="bordered"
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                {modalTitle == ModalTitleItems[1] && (
                  <div>
                    <p>Введите марку машины и номер</p>
                    <div className="flex gap-4">
                      <Input
                        name="name"
                        variant="bordered"
                        placeholder="DAF XF 480"
                        onChange={handleInputChange}
                      />
                      <Input
                        name="state_number"
                        variant="bordered"
                        placeholder="747 CU 01"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                {modalTitle == ModalTitleItems[2] && (
                  <div>
                    <p>Введите марку прицепа и номер</p>
                    <div className="flex gap-4">
                      <Input
                        name="name"
                        variant="bordered"
                        placeholder="SCHMITZ CARGOBUUL"
                        onChange={handleInputChange}
                      />
                      <Input
                        name="state_number"
                        variant="bordered"
                        placeholder="18 AFT 01"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                {modalTitle == ModalTitleItems[3] && (
                  <div>
                    <p>Введите данные</p>
                    <div className="flex flex-col gap-4 mt-4">
                      <Input
                        name="name"
                        variant="bordered"
                        placeholder="Газель NEXT"
                        onChange={handleInputChange}
                      />
                      <Input
                        name="state_number"
                        variant="bordered"
                        placeholder="0754AM 977"
                        onChange={handleInputChange}
                      />
                      <Divider />
                      <Input
                        name="driver_name"
                        variant="bordered"
                        placeholder="Иванов Иван Иванович"
                        onChange={handleInputChange}
                      />
                      <div className="flex gap-3">
                        <Input
                          name="passport_number"
                          variant="bordered"
                          placeholder="Номер паспорта"
                          onChange={handleInputChange}
                        />
                        <Input
                          name="passport_date"
                          variant="bordered"
                          placeholder="Дата выдачи"
                          onChange={handleInputChange}
                        />
                      </div>
                      <Input
                        name="passport_issued"
                        variant="bordered"
                        placeholder="Кем выдан"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрыть
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    mutate(modalTitle);
                    onClose();
                  }}
                >
                  Подтвердить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export const ModalTitleItems = [
  "Добавить водителя",
  "Добавить машину",
  "Добавить прицеп",
  "Добавить газель",
];

export const useDeleteObject = () => {
  const { openModal } = useConfirmContext();

  const { mutate: deleteObject, isPending } = useMutation({
    mutationFn: async ({ id, table }: { id: number; table: string }) =>
      await deleteObj(id, table),
    onSuccess: () => {
      toast({ title: `Объект успешно удалён` });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Попробуйте позже" });
    },
  });

  const confirmDeleteObject = (id: number, table: string, name: string) => {
    openModal({
      action: async () => deleteObject({ id, table }),
      title: "Подтвердите действие",
      description: `Вы уверены, что хотите удалить ${name}?`,
      buttonName: "Подтвердить",
      isLoading: isPending,
    });
  };

  return { confirmDeleteObject };
};
