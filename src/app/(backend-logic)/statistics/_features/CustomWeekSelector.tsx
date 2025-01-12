import {
  Button,
  CalendarDate,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getJustWeeks } from "../../workflow/[slug]/week/[weekId]/trip/_api";
import { useEffect, useState } from "react";
import { WeekType } from "../../workflow/_feature/types";
import React from "react";
import { currentWeekIndicator } from "../../workflow/_feature/WeekCard/WeekCard";

export const CustomWeekSelector = ({
  setWeekNum,
}: {
  setWeekNum: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetWeeksForStatistics"],
    queryFn: async () => getJustWeeks(),
  });

  const [weeks, setWeeks] = useState<WeekType[]>(data);
  const [isPressed, setIsPressed] = useState<{
    week_number: number;
    active: boolean;
  }>();

  useEffect(() => {
    if (data) {
      const currentWeek = data?.find((w) => currentWeekIndicator(w.week_dates));
      setWeeks(data);
      setIsPressed({ week_number: currentWeek?.week_number, active: true });
      setWeekNum(currentWeek?.week_number);
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  return (
    <div>
      <Card>
        <CardHeader>Выбор недели</CardHeader>
        <Divider />
        <CardBody>
          <div className="max-w-[20rem] flex flex-wrap gap-2">
            {weeks
              ?.sort(
                (a, b) =>
                  new Date(a.week_dates.end_date).getTime() -
                  new Date(b.week_dates.end_date).getTime()
              )
              .map((e) => (
                <Button
                  key={e.week_number}
                  size="sm"
                  variant="shadow"
                  isIconOnly
                  isDisabled={
                    isPressed?.week_number === e.week_number && isPressed.active
                  }
                  color={
                    isPressed?.week_number === e.week_number
                      ? "primary"
                      : "default"
                  }
                  onPress={() => {
                    setIsPressed({ week_number: e.week_number, active: true });
                    setWeekNum(e.week_number);
                  }}
                >
                  {e.week_number}
                </Button>
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
