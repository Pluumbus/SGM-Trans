import {
  Button,
  CalendarDate,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Link,
  Spinner,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import {
  getJustWeeks,
  getWeeks,
} from "../../workflow/[slug]/week/[weekId]/trip/_api";
import { useEffect, useState } from "react";
import { WeekType } from "../../workflow/_feature/types";
import React from "react";
import { currentWeekIndicator } from "../../workflow/_feature/WeekCard/WeekCard";
import { TripType } from "../../workflow/_feature/TripCard/TripCard";
import { useParams, usePathname, useRouter } from "next/navigation";
import { PATHS } from "@/lib/consts";
import { WeekTableType } from "@/lib/types/week.types";

export const CustomWeekSelector = ({
  setWeekNum,
  setWeekId,
}: {
  setWeekNum?: React.Dispatch<React.SetStateAction<number>>;
  setWeekId?: React.Dispatch<React.SetStateAction<number>>;
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
      setWeekNum && setWeekNum(currentWeek?.week_number);
      setWeekId && setWeekId(currentWeek?.id);
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
                    setWeekNum && setWeekNum(e.week_number);
                    setWeekId && setWeekId(e.id);
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

export const CustomMainWeekSelector = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetWeeksForStatistics"],
    queryFn: async () => getWeeks(slug as WeekTableType["table_type"]),
  });
  const { slug, weekId } = useParams<{
    slug: string;
    weekId: string;
    id: string;
  }>();
  const router = useRouter();

  const [weeks, setWeeks] =
    useState<(WeekType & { trips: TripType[] })[]>(data);
  const [isPressed, setIsPressed] = useState<{
    week_number: number;
    active: boolean;
  }>();

  useEffect(() => {
    if (data) {
      const currentWeek = data?.find((w) => w.id === Number(weekId));
      const indx = data?.findIndex((w) => w.id === currentWeek.id);
      const sortedWeeks = data?.slice(
        Math.max(0, indx - 2),
        Math.min(data.length, indx + 2)
      );
      setWeeks(sortedWeeks);
      setIsPressed({ week_number: currentWeek?.week_number, active: true });
    }
  }, [data]);

  const handleChangeWeekId = (e) => {
    router.replace(
      `/workflow/${slug}/week/${e.id}/trip/${e.trips[0].trip_number}`
    );
  };

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
                    setIsPressed({
                      week_number: e.week_number,
                      active: true,
                    });
                    handleChangeWeekId(e);
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
