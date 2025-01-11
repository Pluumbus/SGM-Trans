import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdSettings, IoIosCheckmark } from "react-icons/io";
import { updateExchangeRate } from "../../../_api/requests";
import { toast } from "@/components/ui/use-toast";

export const TripInfoExchangeRate = ({
  currentTripData,
}: {
  currentTripData: TripType;
}) => {
  const [exchange, setExchange] = useState<string>(
    currentTripData?.exchange_rate
  );
  const [isChanging, setIsChanging] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ["updateExchangeRate"],
    mutationFn: async () => updateExchangeRate(exchange, currentTripData?.id),
    onSuccess() {
      if (exchange !== undefined || exchange !== null) {
        toast({ title: `Курс валюты успешно изменён на ${exchange}` });
      }
    },
  });

  return (
    <div className="flex justify-between">
      <span>Курс валюты:</span>

      {!isChanging ? (
        <>
          <b>{currentTripData?.exchange_rate || "Отсутствует"}</b>
          <Button isIconOnly size="sm" onPress={() => setIsChanging(true)}>
            <IoMdSettings />
          </Button>
        </>
      ) : (
        <>
          <Input
            size="sm"
            className="w-[6rem]"
            onChange={(e) => setExchange(e.target.value)}
          />
          <Button
            isIconOnly
            size="sm"
            color="success"
            onPress={() => {
              setIsChanging(false);
              mutate();
            }}
          >
            <IoIosCheckmark size={35} />
          </Button>
        </>
      )}
    </div>
  );
};
