"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { COLORS } from "@/lib/colors";
import { Card, CardBody } from "@nextui-org/react";

export const TotalStats = ({ cargos }: { cargos: CargoType[] }) => {
  const totalWeight =
    cargos && cargos.length > 0
      ? cargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.weight.replace(",", "."));
          return isNaN(value) ? sum : sum + value;
        }, 0)
      : 0;

  const totalVolume =
    cargos && cargos.length > 0
      ? cargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.volume.replace(",", "."));
          return isNaN(value) ? sum : sum + value;
        }, 0)
      : 0;

  const totalSumm =
    cargos && cargos.length > 0
      ? cargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.amount.value.replace(/\s+/g, ""));
          return isNaN(value) ? sum : sum + value;
        }, 0)
      : 0;

  const totalClientsCount =
    cargos && cargos.length > 0
      ? cargos.reduce((count, cargo) => {
          const client = cargo.client_bin;
          return client && client.tempText?.trim().length > 0
            ? count + 1
            : count;
        }, 0)
      : 0;

  const totalDocumentsCount =
    cargos && cargos.length > 0
      ? cargos.reduce((count, cargo) => {
          return cargo.is_documents ? count + 1 : count;
        }, 0)
      : 0;

  return (
    <div>
      <Card className="mb-3">
        <CardBody>
          <div className="flex justify-around">
            <span>
              Общий вес:{" "}
              <b
                style={{
                  color: `${totalWeight <= 11 ? `${COLORS.green}` : totalWeight <= 19.9 ? `${COLORS.yellow}` : totalWeight <= 22 ? `${COLORS.orange}` : `${COLORS.red}`}`,
                }}
              >
                {totalWeight}/22
              </b>{" "}
              тонн
              <div
                style={{
                  color: `${COLORS.red}`,
                }}
                className="font-bold"
              >
                {totalWeight > 22 && "Разгрузите машину"}
              </div>
            </span>
            <span>
              Общий объем:{" "}
              <b
                style={{
                  color: `${totalVolume <= 47 ? `${COLORS.green}` : totalVolume <= 79 ? `${COLORS.yellow}` : totalVolume <= 92 ? `${COLORS.orange}` : `${COLORS.red}`}`,
                }}
              >
                {totalVolume}/92
              </b>{" "}
              м.куб.
              <div
                style={{
                  color: `${COLORS.red}`,
                }}
                className="font-bold"
              >
                {totalVolume > 92 && "Разгрузите машину"}
              </div>
            </span>
            <span>
              Сумма:{" "}
              <b
                style={{
                  color: `${totalSumm < 2500000 ? `${COLORS.red}` : `${COLORS.green}`}`,
                }}
              >
                {totalSumm}
              </b>{" "}
              тг
            </span>
          </div>
          <div className="flex justify-around">
            <span>
              Кол-во клиентов: <b>{totalClientsCount}</b>{" "}
            </span>
            <span>
              Кол-во СНТ: <b>{totalDocumentsCount}</b>
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};