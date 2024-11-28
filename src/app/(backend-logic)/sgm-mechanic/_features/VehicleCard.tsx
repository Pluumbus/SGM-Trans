import { Card, CardBody, CardHeader, useDisclosure } from "@nextui-org/react";
import {
  ReportStatisticsType,
  VehicleObject,
  VehicleReportStatisticsType,
} from "../_api/types";
import { ManageDetails } from "./Modals";

type VehicleCardProps = {
  vehicle: VehicleObject;
};

type ReportCardProsp = {
  vehicle: VehicleReportStatisticsType;
};
export const VehicleCard = ({ vehicle }: ReportCardProsp) => {
  const { name, mw, fuel } = vehicle;
  const disclosure = useDisclosure();

  return (
    <>
      <Card
        className="w-full max-w-md mx-auto my-4"
        isPressable
        isHoverable
        onClick={() => {
          disclosure.onOpenChange();
        }}
      >
        <CardHeader className="bg-gray-100">
          <span className="font-bold text-lg">{name}</span>
        </CardHeader>
        <CardBody>
          <div className="space-y-2 flex flex-col">
            <span>
              <span className="font-semibold">Максимальная скорость:</span>{" "}
              {parseFloat(mw.maxSpeed.toFixed(3)) || ""}
            </span>
            <span>
              <span className="font-semibold">
                Пробег с превышением скорости:
              </span>{" "}
              {parseFloat(mw.mileageSpeeding.toFixed(2))}
            </span>
            <span>
              <span className="font-semibold">Пробег:</span>{" "}
              {parseFloat(mw.mileage.toFixed(2))} км
            </span>
            <span>
              <span className="font-semibold">Обороты двигателя:</span>{" "}
              {mw.normalRPM}
            </span>
            <span>
              <span className="font-semibold">Начальный объем бака:</span>{" "}
              {fuel.startVolume}
            </span>
            <span>
              <span className="font-semibold">Конечный объем бака:</span>{" "}
              {fuel.endVolume}
            </span>
          </div>
        </CardBody>
      </Card>

      <ManageDetails disclosure={disclosure} />
    </>
  );
};
