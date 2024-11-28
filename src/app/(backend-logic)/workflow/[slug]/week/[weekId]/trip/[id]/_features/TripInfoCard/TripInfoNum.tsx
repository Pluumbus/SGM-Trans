import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IoIosCheckmark, IoMdSettings } from "react-icons/io";
import { updateTripNumber } from "../../../_api/requests";
import { toast } from "@/components/ui/use-toast";

export const TripInfoNum = ({ id, tempId }: { id: number; tempId: number }) => {
  const [tripNumber, setTripNumber] = useState(id);
  const [isChanging, setIsChanging] = useState(false);
  const { mutate } = useMutation({
    mutationKey: ["updateTripNum"],
    mutationFn: async () => updateTripNumber(tripNumber, id),
    onSuccess() {
      toast({ title: `Номер рейса успешно изменён на ${tripNumber}` });
    },
  });
  return (
    <div className="flex justify-between">
      <span>Номер рейса:</span>

      {!isChanging ? (
        <>
          <b>{tempId}</b>
          <Button isIconOnly size="sm" onPress={() => setIsChanging(true)}>
            <IoMdSettings />
          </Button>
        </>
      ) : (
        <>
          <Input
            size="sm"
            className="w-[6rem]"
            onChange={(e) => setTripNumber(Number(e.target.value))}
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
