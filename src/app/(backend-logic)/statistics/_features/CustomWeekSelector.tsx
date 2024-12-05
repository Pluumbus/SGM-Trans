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

export const CustomWeekSelector = ({
  setDateVal,
}: {
  setDateVal: React.Dispatch<
    React.SetStateAction<{
      start: string;
      end: string;
    }>
  >;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetWeeksForStatistics"],
    queryFn: async () => getJustWeeks(),
  });

  const [weeks, setWeeks] = useState<WeekType[]>(data);

  useEffect(() => {
    if (data) setWeeks(data);
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
              ?.sort((a, b) => a.week_number - b.week_number)
              .map((e) => (
                <Button
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  onPress={() =>
                    setDateVal({
                      start: e.week_dates.start_date,
                      end: e.week_dates.end_date,
                    })
                  }
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
