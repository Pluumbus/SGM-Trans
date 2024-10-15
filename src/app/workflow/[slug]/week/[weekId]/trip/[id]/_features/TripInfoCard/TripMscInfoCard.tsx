import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
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
import RoleBasedWrapper from "@/components/roles/RoleBasedWrapper";

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
  const [statusVal, setStatusVal] = useState<string | undefined>();

  useEffect(() => {
    const currentTrip = tripsData.find(
      (item) => item.id === Number(selectedTabId)
    );
    // setStatusVal(currentTrip?.status);
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

  //   const { mutate: setDateOutMutation } = useMutation({
  //     mutationKey: ["setTripDate"],
  //     mutationFn: async (date: string) =>
  //       await updateTripDate(date, selectedTabId, false),
  //     onSuccess() {
  //       toast({
  //         title: "Дата рейса успешно обновлён",
  //       });
  //     },
  //   });

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
    <Card className="bg-gray-200 w-80 h-24">
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="flex justify-between">
              Дата выезда:
              {dateVal == dateItmes[0] ? (
                <DatePicker
                  className="w-2/3"
                  aria-label="Установить дату выхода"
                  onChange={handleSetDateChange}
                />
              ) : (
                <b>{dateValIn}</b>
              )}
            </span>
            <span className="flex justify-between">
              Дата прибытия:
              {dateVal == dateItmes[1] ? (
                <DatePicker
                  className="w-2/3"
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
