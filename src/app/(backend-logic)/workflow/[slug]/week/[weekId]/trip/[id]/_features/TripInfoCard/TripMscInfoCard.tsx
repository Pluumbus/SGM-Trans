import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { toast } from "@/components/ui/use-toast";
import {
  Button,
  Card,
  CardBody,
  DatePicker,
  DateValue,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { updateTripDate } from "../../../_api/requests";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";

export const TripInfoMscCard = ({
  selectedTabId,
  tripsData,
}: {
  selectedTabId: ReactNode;
  tripsData: TripType[];
}) => {
  const [dateVal, setDateVal] = useState<string | undefined>();
  const [dateValIn, setDateValIn] = useState<string | undefined>();
  const [dateValOut, setDateValOut] = useState<string | undefined>();

  useEffect(() => {
    const currentTrip = tripsData.find(
      (item) => item.id === Number(selectedTabId)
    );
    setDateValIn(currentTrip?.date_in);
    setDateValOut(currentTrip?.date_out);
  }, [selectedTabId, tripsData]);

  const { mutate: setDateMutation } = useMutation({
    mutationKey: ["setTripDate"],
    mutationFn: async ({ date, dateIn }: { date: string; dateIn: boolean }) =>
      await updateTripDate(date, selectedTabId, dateIn),
    onSuccess() {
      toast({
        title: "Дата рейса успешно обновлён",
      });
    },
  });

  const handleSetDateChange = (date: DateValue | null) => {
    const dateStr = new Date(
      date.year,
      date.month - 1,
      date.day
    ).toLocaleDateString();

    if (dateVal == dateItmes[0]) {
      setDateValIn(dateStr);

      setDateMutation({ date: dateStr, dateIn: true });
    } else {
      setDateValOut(dateStr);
      setDateMutation({ date: dateStr, dateIn: false });
    }
    setDateVal("");
  };

  const dateItmes = ["Установить дату выхода", "Установить дату прихода"];

  return (
    <Card className="bg-gray-200 w-full h-24">
      <CardBody>
        <div className="w-full flex justify-between">
          <div className="grid grid-cols-2 items-center gap-2">
            <span>Дата выезда:</span>
            <span>
              {dateVal == dateItmes[0] ? (
                <DatePicker
                  aria-label="Установить дату выхода"
                  onChange={handleSetDateChange}
                />
              ) : (
                <b>{dateValIn}</b>
              )}
            </span>
            <span className="flex justify-between">Дата прибытия:</span>
            <span>
              {dateVal == dateItmes[1] ? (
                <DatePicker
                  aria-label="Установить дату прихода"
                  onChange={handleSetDateChange}
                />
              ) : (
                <b>{dateValOut}</b>
              )}
            </span>
          </div>
          <RoleBasedWrapper allowedRoles={["Логист Москва", "Админ"]}>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" color="default">
                  <IoMdSettings />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {dateItmes.map((stat: string) => (
                  <DropdownItem
                    key={stat}
                    onClick={() => {
                      setDateVal(stat);
                    }}
                  >
                    {stat}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </RoleBasedWrapper>
        </div>
      </CardBody>
    </Card>
  );
};
