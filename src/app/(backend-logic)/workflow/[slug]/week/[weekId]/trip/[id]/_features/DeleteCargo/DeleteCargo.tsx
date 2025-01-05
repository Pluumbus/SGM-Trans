import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { deleteCargo } from "../../../_api/requests";
import { useToast } from "@/components/ui/use-toast";
import { useSelectionStore } from "../store";
import { useConfirmContext, useDebounce } from "@/tool-kit/hooks";

export const DeleteCargo = () => {
  const { toast } = useToast();
  const { openModal } = useConfirmContext();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCargo,
    onSuccess: () => {
      toast({
        title: "Вы успешно удалили груз",
      });
    },
  });
  const { debounce, cancel } = useDebounce();
  const hadnleDeleteCargos = () => {
    debounce(() => {
      mutate(rowSelected.filter((e) => e.isSelected).map((e) => e.number));
    }, 10000);
    toast({
      title: "Вы успешно удалили груз",
      description: (
        <Button
          onPress={() => {
            cancel();
            toast({
              title: "Удаление отменено",
            });
          }}
          variant="light"
        >
          Отменить
        </Button>
      ),
      duration: 10000,
    });
  };
  const { rowSelected } = useSelectionStore();
  return (
    <div>
      <Button
        variant="bordered"
        color="danger"
        onPress={() => {
          openModal({
            action: async () => hadnleDeleteCargos(),
            isLoading: isPending,
            title: "Вы уверены что хотите удалить выбранные грузы?",
            buttonName: "Удалить",
          });
        }}
      >
        Удалить выбранные грузы?
      </Button>
    </div>
  );
};
