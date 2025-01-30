import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { updateTripDriver } from "../../../_api/requests";
import { getSeparatedNumber } from "@/tool-kit/hooks";

export const TripInfoPayHireDriver = ({
  currentTripData,
}: {
  currentTripData: TripType;
}) => {
  const hireDriver = currentTripData?.driver.hire;
  const { mutate: setPaymentToHireMutation } = useMutation({
    mutationKey: ["setPaymentToHire"],
    mutationFn: async () =>
      await updateTripDriver(
        { ...currentTripData?.driver, hire: { ...hireDriver, isPaid: true } },
        currentTripData?.id
      ),
    onSuccess() {
      toast({
        title: "Оплата проведена",
      });
    },
  });
  return (
    <div className="flex flex-col gap-2">
      <span>
        Дата найма : <b>{hireDriver.hire_date}</b>
      </span>
      <Button
        color="success"
        isDisabled={hireDriver.isPaid}
        onPress={() => setPaymentToHireMutation()}
      >
        {hireDriver.isPaid
          ? "Оплачено " +
            getSeparatedNumber(Number(hireDriver.amount)) +
            " " +
            hireDriver.type
          : " Оплатить " +
            getSeparatedNumber(Number(hireDriver.amount)) +
            " " +
            hireDriver.type}
      </Button>
    </div>
  );
};
