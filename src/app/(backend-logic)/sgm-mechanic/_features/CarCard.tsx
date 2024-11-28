import {
  CarDetailType,
  CarsType,
} from "@/lib/references/drivers/feature/types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { ManageDetails } from "./Modals";
import { getSeparatedNumber } from "@/tool-kit/hooks";
import { IoAddOutline } from "react-icons/io5";
import { VehicleReportStatisticsType } from "../_api/types";

export const CarCard = ({
  car,
}: {
  car: CarsType & {
    omnicommData?: VehicleReportStatisticsType;
  };
}) => {
  const disclosure = useDisclosure();

  return (
    <>
      <Card>
        <CardHeader className="justify-between">
          <div className="flex p-3 w-full gap-2 items-center h-full subpixel-antialiased">
            <span className="font-semibold">{car.car}</span>
            <Divider orientation="vertical" />
            <span className="text-sm text-center">{car.state_number}</span>
            <Divider orientation="vertical" />
            <span className="font-semibold">
              {parseFloat(
                !isNaN(car.omnicommData?.mw?.mileage)
                  ? car.omnicommData?.mw?.mileage.toString()
                  : "0"
              ).toFixed(2)}{" "}
              км
            </span>
          </div>
          <Button
            isIconOnly
            size="sm"
            onClick={() => {
              disclosure.onOpenChange();
            }}
          >
            <IoAddOutline className="text-lg" />
          </Button>
        </CardHeader>
        <CardBody>
          <div className="w-full">
            {car?.details?.map((e) => <DetailCard e={e} car={car} />)}
          </div>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      <ManageDetails disclosure={disclosure} car={car} />
    </>
  );
};

const DetailCard = ({ e, car }: { e: CarDetailType; car: CarsType }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <div
        className="grid grid-cols-2 items-center cursor-pointer hover:opacity-70"
        onClick={() => {
          disclosure.onOpenChange();
        }}
      >
        <span>{e.name}:&nbsp;</span>
        <Tooltip content={<span>До замены осталось</span>} showArrow>
          <span className="text-green-600">
            {getSeparatedNumber(Number(e.mileage_to_inform))} км
          </span>
        </Tooltip>
      </div>
      <Divider />
      <ManageDetails disclosure={disclosure} car={car} isUpdate detail={e} />
    </>
  );
};
