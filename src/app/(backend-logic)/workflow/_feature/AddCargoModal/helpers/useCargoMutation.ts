import { useMutation } from "@tanstack/react-query";
import { addCargo } from "../../WeekCard/requests";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReset } from "react-hook-form";
import { CargoType } from "../../types";
import { useDisclosure } from "@nextui-org/react";

export const useCargoMutation = (
  onOpenChangeCargo: () => void,
  reset: UseFormReset<CargoType>,
  tripDisclosure?: ReturnType<typeof useDisclosure>
) => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: addCargo,
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Вы успешно добавили груз",
      });
      onOpenChangeCargo();
      tripDisclosure && tripDisclosure.onOpenChange();
      reset();
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description:
          "Не получилось добавить груз, проверьте поле 'сумма оплаты'",
      });
    },
  });
};
