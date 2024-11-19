import { useToast } from "@/components/ui/use-toast";
import { CargoType } from "../../types";

export const useValdiateForm = () => {
  const { toast } = useToast();

  return function (data: CargoType) {
    if (!(data.transportation_manager && data.amount?.value)) {
      toast({
        title: "Ошибка",
        description:
          "Поля 'Сумма оплаты (тг)' и 'Плательщик (Менеджер ведущий перевозку)' должны быть заполнены",
      });
      return false;
    } else {
      return true;
    }
  };
};
