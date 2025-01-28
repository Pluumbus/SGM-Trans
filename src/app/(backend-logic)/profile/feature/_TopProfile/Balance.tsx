import { getUserCargos } from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/_api";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  ScrollShadow,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

export const BalanceHistory = () => {
  const { user } = useUser();

  const { data } = useQuery({
    queryKey: ["getUserCargos"],
    queryFn: async () => await getUserCargos(user?.id),
  });

  return (
    <div>
      <ScrollShadow className="max-h-[16rem] grid gap-2">
        {data
          ?.sort((a, b) => b.trip_number - a.trip_number)
          .map((p, i) => (
            <Card key={i}>
              <CardHeader className="flex justify-between">
                <b>Рейс {p.trip_number} </b>
                {p.status && `Статус: ${p.status}`}
              </CardHeader>
              <Divider />
              <CardBody className="grid grid-cols-2">
                {p.cargos.map(
                  (crg) =>
                    crg.act_details.is_ready &&
                    !crg.act_details.isPaidBack &&
                    !crg.is_deleted && (
                      <div className="flex flex-col">
                        <span>Клиент: {crg.client_bin.tempText}</span>
                        <span>
                          Потрачено баланса: {crg.act_details.amount}{" "}
                        </span>
                        <span>
                          Дата:{" "}
                          {new Date(
                            crg.act_details.date_of_act_printed
                          ).toLocaleDateString()}
                        </span>
                        <Divider />
                      </div>
                    )
                )}
              </CardBody>
            </Card>
          ))}
      </ScrollShadow>
    </div>
  );
};
