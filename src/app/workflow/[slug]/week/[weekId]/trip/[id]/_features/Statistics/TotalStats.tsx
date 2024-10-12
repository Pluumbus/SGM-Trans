import { CargoType } from "@/app/workflow/_feature/types";
import { COLORS } from "@/lib/colors";
import { Card, CardBody } from "@nextui-org/react";

export const TotalStats = ({ allCargos }: { allCargos: CargoType[] }) => {
  const totalWeight =
    allCargos && allCargos.length > 0
      ? allCargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.weight);
          return isNaN(value) ? sum : sum + value;
        }, 0)
      : 0;

  const totalVolume =
    allCargos && allCargos.length > 0
      ? allCargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.volume);
          return isNaN(value) ? sum : sum + value;
        }, 0)
      : 0;

  const totalSumm =
    allCargos && allCargos.length > 0
      ? allCargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.amount.value);
          return isNaN(value) ? sum : sum + value;
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
        </CardBody>
      </Card>
      ;
    </div>
  );
};
