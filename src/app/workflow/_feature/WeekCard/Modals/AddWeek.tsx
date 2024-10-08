import { Button } from "@nextui-org/react";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import supabase from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";

export const AddWeek = () => {
  const { toast } = useToast();

  const { slug } = useParams();

  const { mutate: addWeek } = useMutation({
    mutationFn: async () => {
      await supabase.from(`weeks`).insert({ table_type: slug });
    },
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Вы успешно создали неделю",
      });
    },
    onError: () => {
      toast({
        title: "Произошла ошибка",
        description: "Попробуйте позже",
      });
    },
  });

  return (
    <div>
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            addWeek();
          }}
        >
          Добавить неделю
        </Button>
      </div>
    </div>
  );
};
