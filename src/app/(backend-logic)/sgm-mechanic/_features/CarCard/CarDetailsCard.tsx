import {
  AccumulatorType,
  BreakShowType,
  CarDetailsType,
  CarsType,
  DetailType,
  MileageType,
  VehicleAxis,
  WheelType,
} from "@/lib/references/drivers/feature/types";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import { DetailIcon } from "./DetailIcon";
import { VehicleReportStatisticsType } from "../../_api/types";
import { ManageDetail } from "../Modals";
import { DetailNameType, useDisclosureContext } from "../DisclosureContext";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { swapAccumulators, updateDetailToCar } from "../../_api/supa.requests";
import { useEffect, useId, useMemo } from "react";
import { GiCarWheel, GiStoneWheel } from "react-icons/gi";
import { IoSwapVerticalOutline } from "react-icons/io5";
import { useConfirmContext } from "@/tool-kit/hooks";
import { useToast } from "@/components/ui/use-toast";
import { FaX } from "react-icons/fa6";
import { ChangeMileage } from "./ChangeMileage";

export type FieldDataType =
  | DetailType
  | AccumulatorType
  | WheelType["brake_shoe"]
  | WheelType["wheel"];

export const CarDetailsCard = ({
  car: oCarInfo,
}: {
  car: CarsType & {
    omnicommData: VehicleReportStatisticsType;
  };
}) => {
  const car = useMemo(() => oCarInfo, [oCarInfo]);

  const { details: carDetails } = car;
  const { details: commonDetails } = carDetails;
  const { setData, onOpenChange } = useDisclosureContext();

  const handleSetCarData = () => {
    setData((prev) => ({ ...prev, car }));
  };

  useEffect(() => {
    if (car) setData((prev) => ({ ...prev, car }));
  }, [car]);

  const handleOpenDetail = (
    detail:
      | CarDetailsType["details"][number]
      | CarDetailsType["vehicle_axis"][number]
      | WheelType["brake_shoe"]
      | WheelType["wheel"]
      | CarDetailsType["accumulator"]["accumulators"][number]
  ) => {
    setData((prev) => {
      const res = {
        ...prev,
        type: "detail",
        detail: detail,
      };
      delete res?.index;
      delete res?.side;
      return res;
    });
    onOpenChange();
  };
  const id = useId();

  return (
    <>
      <Card shadow="none">
        <CardBody
          onClick={() => {
            handleSetCarData();
          }}
        >
          <div className="w-full">
            <ChangeMileage car={car} />
            <div className="w-full text-sm flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2 w-full">
                {commonDetails.map((e, index) => (
                  <div
                    className="leading-4 flex flex-col gap-1 w-full cursor-pointer hover:opacity-70"
                    key={`Common detail ${e.name} ${e.installation_date} ${id}`}
                    onClick={() => handleOpenDetail(e)}
                  >
                    <div className="flex w-full items-end gap-2">
                      <span className="font-semibold text-center">
                        {e.name}
                      </span>
                      <DetailIcon name={e.name} />
                    </div>

                    <DetailSampleCard fieldData={e} />
                    <div className="grid grid-cols-2">
                      <span className="text-danger-500">
                        {parseFloat(Number(e.mileage.last_mileage)).toFixed(2)}
                        км
                      </span>
                      <span className="text-success-500 text-center">
                        {parseFloat(Number(e.mileage.next_mileage)).toFixed(2)}
                        км
                      </span>
                    </div>
                    {index !== commonDetails.length - 1 && <Divider />}
                  </div>
                ))}
              </div>
              <Divider />
              <div>
                <AccumCard accumData={carDetails.accumulator} />
              </div>
              <Divider />
              <div>
                <Axis axis={carDetails.vehicle_axis} />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <ManageDetail />
    </>
  );
};

const Axis = ({ axis }: { axis: CarDetailsType["vehicle_axis"] }) => {
  const { data } = useDisclosureContext();
  const { openModal } = useConfirmContext();
  const { mutate, isPending } = useMutation({
    mutationFn: updateDetailToCar,
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error updating detail:", error);
    },
  });
  const handleAddAxis = () => {
    mutate({
      car: data.car,
      section: "axis",
      updatedDetail: emptyAxis,
    });
  };
  const handleDeleteAxis = (i: number) => {
    openModal({
      action: async () =>
        mutate({
          car: data.car,
          section: "deleteAxis",
          updatedDetail: { index: i },
        }),
      isLoading: isPending,
      title: "Удалить ОСЬ?",
      buttonName: "Удалить",
    });
  };
  return (
    <>
      {axis.map((e, i) => (
        <>
          <div key={i + 5} className="w-full overflow-hidden relative">
            {axis.length > 1 && (
              <div className="w-full flex justify-end">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onClick={() => {
                    handleDeleteAxis(i);
                  }}
                >
                  <FaX size={10} />
                </Button>
              </div>
            )}
            <div className="flex h-full w-full gap-3 overflow-hidden">
              <Wheel prop={e.left} side={"left"} index={i} />

              <Divider orientation="vertical" className="h-auto relative" />

              <Wheel prop={e.right} side={"right"} index={i} />
            </div>
          </div>
          <div className="pt-2">
            <Divider />
          </div>
          <div className="col-span-2 w-full flex justify-center mt-2">
            {i == axis.length - 1 && i < 5 && (
              <Button
                isIconOnly
                size="sm"
                fullWidth
                variant="light"
                color="success"
                onClick={() => {
                  handleAddAxis();
                }}
              >
                <FaPlus size={18} />
              </Button>
            )}
          </div>
        </>
      ))}
    </>
  );
};

const emptyAxis = {
  left: {
    brake_shoe: {
      installation_date: "",
      mileage: {
        last_mileage: 0,
        next_mileage: 0,
      },
      model: "",
    },
    wheel: {
      installation_date: "",
      mileage: {
        last_mileage: 0,
        next_mileage: 0,
      },
    },
  },
  right: {
    brake_shoe: {
      installation_date: "",
      mileage: {
        last_mileage: 0,
        next_mileage: 0,
      },
      model: "",
    },
    wheel: {
      installation_date: "",
      mileage: {
        last_mileage: 0,
        next_mileage: 0,
      },
    },
  },
} satisfies VehicleAxis;
const Wheel = ({
  prop,
  index,
  side,
}: {
  prop: WheelType;
  index: number;
  side: "left" | "right";
}) => {
  const { onOpenChange, setData } = useDisclosureContext();

  const { wheel, brake_shoe } = prop;

  const handleOpen = (
    type: DetailNameType,
    data: BreakShowType | WheelType["wheel"]
  ) => {
    const res = data;
    delete res?.name;
    if (type !== "brake_shoe") delete res?.model;
    const dataToPass = { ...res, index, side };

    setData({ type, detail: dataToPass });
    onOpenChange();
  };

  return (
    <div className={`grid grid-cols-2 w-full `}>
      <div
        onClick={() => {
          handleOpen("wheel", wheel);
        }}
        className={`cursor-pointer hover:opacity-70 ${side == "right" && "order-2"}`}
      >
        <div className="flex gap-1 items-center">
          <span className="font-semibold">Колесо</span>
          <GiCarWheel size={18} />
        </div>
        <DetailSampleCard fieldData={wheel} v="short" />
      </div>
      <div
        onClick={() => {
          handleOpen("brake_shoe", brake_shoe);
        }}
        className="cursor-pointer hover:opacity-70"
      >
        <div className="flex gap-1 items-center">
          <span className="font-semibold">Колодка</span>
          <GiStoneWheel size={18} />
        </div>
        <DetailSampleCard fieldData={brake_shoe} v="short" />
        <div className="flex gap-1 leading-3">
          <span>Модель: </span>
          <span className="font-semibold">{brake_shoe.model}</span>
        </div>
      </div>
    </div>
  );
};

const DetailSampleCard = ({
  fieldData,
  v = "long",
}: {
  fieldData: FieldDataType;
  v?: "short" | "long";
}) => {
  const { data } = useDisclosureContext();
  return (
    <>
      <div className={v == "short" ? "flex gap-1" : "grid grid-cols-2"}>
        <span>{v == "short" ? "ДУ: " : "Дата установки: "}</span>
        <span className="font-semibold text-center">
          {fieldData?.installation_date}
        </span>
      </div>
      <div className={v == "short" ? "flex gap-1" : "grid grid-cols-2"}>
        <span>{v == "short" ? "КМ: " : "Пробег: "} </span>
        <span className="font-semibold text-center">
          {parseFloat(
            (
              Number(
                data?.car?.omnicommData?.mw?.mileage
                  ? parseFloat(
                      data?.car?.omnicommData?.mw?.mileage.toString()
                    ).toFixed(2)
                  : 0
              ) - Number(fieldData?.mileage?.last_mileage)
            ).toString()
          ).toFixed(2)}
          {v !== "short" && " км"}
        </span>
      </div>
    </>
  );
};
const AccumCard = ({
  accumData,
}: {
  accumData: CarsType["details"]["accumulator"];
}) => {
  const { onOpenChange, setData, data } = useDisclosureContext();

  const handleOpen = (data: AccumulatorType) => {
    setData({ type: "accumulator", detail: { ...data } });
    onOpenChange();
  };
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => await swapAccumulators(data.car),
    onSuccess: () => {
      toast({
        title: "Вы успешно поменяли аккумуляторы местами",
      });
    },
    onError(error) {
      toast({
        title: "Ошибка",
        description: `${error.message}`,
      });
    },
  });
  const { openModal } = useConfirmContext();

  return (
    <div className="w-full">
      {accumData.accumulators
        ?.sort((a, b) => {
          if (a.location === "Верхний" && b.location !== "Верхний") return -1;
          if (a.location !== "Верхний" && b.location === "Верхний") return 1;
          return 0;
        })
        .map((e, i) => (
          <>
            <div
              className="flex flex-col gap-2 pb-2 cursor-pointer hover:opacity-70"
              key={`Accum ${i + 2}`}
              onClick={() => {
                handleOpen(e);
              }}
            >
              <div>
                <span className="font-semibold">{e?.location}</span>
                <div className="grid grid-cols-2 ">
                  <span>Модель аккумулятора: </span>
                  <span className="font-semibold text-center">{e?.model}</span>
                </div>

                <DetailSampleCard fieldData={e} />
              </div>
            </div>
            {i == 0 && (
              <div
                className="relative py-4 cursor-pointer hover:opacity-70"
                onClick={() => {
                  openModal({
                    action: async () => mutate(),
                    isLoading: isPending,
                    title: "Поменять аккумуляторы местами?",
                    buttonName: "Поменять",
                  });
                }}
              >
                <Divider className="relative" />
                <IoSwapVerticalOutline
                  className="absolute self-center top-1 left-[45%]"
                  size={22}
                />
              </div>
            )}
          </>
        ))}

      <div className="w-full grid grid-cols-2 items-center">
        <span>Последний раз их меняли местами:</span>

        <span className="font-semibold text-center">
          {new Date(accumData?.last_swap).toLocaleDateString()}:
          {new Date(accumData?.last_swap).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
