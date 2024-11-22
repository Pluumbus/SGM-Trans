import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { VehicleObject } from "../_api/types";

type VehicleCardProps = {
  vehicle: VehicleObject;
};

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const { name, details } = vehicle;
  const {
    vehicle: vehicleInfo,
    movement,
    engine,
    mainTank,
    safeDriving,
  } = details;

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader className="bg-gray-100">
        <span className="font-bold text-lg">{name}</span>
      </CardHeader>
      <CardBody>
        <div className="space-y-2 flex flex-col">
          <span>
            <span className="font-semibold">Функция автомобиля:</span>{" "}
            {vehicleInfo.function || ""}
          </span>
          <span>
            <span className="font-semibold">Год производства:</span>{" "}
            {vehicleInfo.engineManufacturer || ""}
          </span>
          <span>
            <span className="font-semibold">Пробег:</span>{" "}
            {movement.mileageDrift} км
          </span>
          <span>
            <span className="font-semibold">Обороты двигателя:</span>{" "}
            {engine.rpmIdling}
          </span>
          <span>
            <span className="font-semibold">Тип двигателя:</span>{" "}
            {mainTank.fuelType}
          </span>
          <span>
            <span className="font-semibold">Расход двигателем в час:</span>{" "}
            {mainTank.motorHourConsumption}
          </span>
          <span>
            <span className="font-semibold">Расход двигателем в час:</span>{" "}
            {movement.mileageDrift}
          </span>
        </div>
      </CardBody>
    </Card>
  );
};
