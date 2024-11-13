"use client";
import { COLORS } from "@/lib/colors";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";

export const CarList = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredCard, setIsHoveredCard] = useState(false);

  const [settings, setSettings] = useState<
    {
      id: number | string;
      isCardClicked: boolean;
      isTiresClicked: boolean;
      isTireHovered: boolean;
      isCardHovered: boolean;
    }[]
  >(
    MOCK_DATA.map((e) => ({
      id: e.id,
      isCardClicked: false,
      isTiresClicked: false,
      isTireHovered: false,
      isCardHovered: false,
    })),
  );

  const setSettingsById = (
    id,
    type: "Tires" | "Card",
    action: "Hover" | "Click",
    value: boolean | "",
  ) => {
    const res = settings.map((e) => {
      if (e.id == id && type == "Tires") {
        if (action == "Hover") {
          return { ...e, isTireHovered: value };
        } else if (action == "Click") {
          return { ...e, isTiresClicked: value };
        }
      } else if (e.id == id && type == "Card") {
        if (action == "Hover") {
          return { ...e, isCardHovered: value };
        } else if (action == "Click") {
          return { ...e, isCardClicked: value };
        }
      } else {
        return e;
      }
    });
    setSettings(res);
  };

  useEffect(() => {
    if (settings) {
      console.log(settings);
    }
  }, [settings]);
  return (
    <div>
      <div className="grid gap-4 grid-cols-4 ">
        {MOCK_DATA.map((e, index) => (
          <Card
            key={e.id}
            onClick={() => {
              setSettingsById(e.id, "Card", "Click", true);
            }}
            onMouseEnter={() => {
              setSettingsById(e.id, "Card", "Hover", true);
            }}
            onMouseLeave={() => {
              setSettingsById(e.id, "Card", "Hover", false);
            }}
            className={`border p-4 transition-all duration-300 col-span-1 ${settings.find((el) => el.id == e.id).isCardHovered ? `row-span-2` : "row-span-1"}`}
          >
            <CardHeader className="flex items-center">
              <span>{e.car}</span>
              <div className="h-full mx-2 w-[1px] bg-gray-300"></div>
              <span>{e.state_number}</span>
            </CardHeader>

            <CardBody className="mt-2">
              <Image src={IMGAGES[index % 4]} />
              {settings.find((el) => el.id == e.id).isCardHovered && (
                <div className={`transition-opacity duration-300 `}>
                  <div
                    className="grid grid-cols-2 gap-4 mt-4"
                    onMouseLeave={() => {
                      setSettingsById(e.id, "Tires", "Hover", false);
                    }}
                  >
                    <SettingsCard
                      tire={e.params.tires[0]}
                      className="col-span-1"
                      onMouseEnter={() => {
                        setSettingsById(e.id, "Tires", "Hover", true);
                      }}
                    />

                    {settings.find((el) => el.id == e.id).isTireHovered &&
                      e.params.tires
                        .slice(1)
                        .map((tire, index) => <SettingsCard tire={tire} />)}

                    <Card>
                      <CardBody>
                        <Image
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Porsche_3512_engine_rear-left_2019_Prototyp_Museum.jpg/800px-Porsche_3512_engine_rear-left_2019_Prototyp_Museum.jpg"
                          width={150}
                          height={50}
                        />
                        <span>{e.params.engine.last_change}</span>
                        <Divider orientation="horizontal" />
                        <span style={{ color: COLORS.green }}>
                          {e.params.engine.mileage} км
                        </span>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <Image
                          src="https://di-uploads-pod16.dealerinspire.com/vikingmotors/uploads/2019/01/Synthetic-Motor-Oil-Change.jpg"
                          width={150}
                          height={50}
                        />
                        <span>{e.params.engine.last_change}</span>
                        <Divider orientation="horizontal" />
                        <Tooltip
                          showArrow={true}
                          content={<span>Вам нужно заменить масло</span>}
                        >
                          <div className="flex gap-2 items-center">
                            <span style={{ color: COLORS.red }}>
                              {e.params.engine.mileage} км
                            </span>
                            <CiCircleInfo size={18} />
                          </div>
                        </Tooltip>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              )}
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SettingsCard = ({
  tire,
  ...settings
}: {
  tire: {
    last_change: string;
    location: string;
    mileage: number;
  };
}) => {
  return (
    <Card className="transition-all duration-300 col-span-1" {...settings}>
      <CardBody>
        <Image
          src="https://wallpapers.com/images/featured/tyres-png-q9h2c4y9nd0gy6e4.jpg"
          width={80}
          height={50}
        />

        <Tooltip showArrow={true} content={<span>Дата последней замены</span>}>
          <span>{tire.last_change}</span>
        </Tooltip>

        <Divider orientation="horizontal" />

        <span>{tire.location}</span>

        <Divider orientation="horizontal" />

        <Tooltip
          showArrow={true}
          content={<span>Вам стоит предусмотреть скорую замену</span>}
        >
          <div className="flex gap-2 items-center">
            <span style={{ color: COLORS.orange }}>{tire.mileage} км</span>
            <CiCircleInfo size={18} />
          </div>
        </Tooltip>
      </CardBody>
    </Card>
  );
};

const IMGAGES = [
  "https://www.truck1.eu/img/Truck_MAN_MAN_TGL_12_250_TGL_12_250-xxl-8682/8682_7259881371437.jpg",
  "https://strg2.nm.kz/neofiles/serve-image/5368b7ed66726f4f134c0000/1190x500/q90",
  "https://storage.yandexcloud.net/cdn.carso.ru/uploads/new_car/264/images/large_largus_furgon_1.jpg",
  "https://www.truck1-kz.com/img/Tyagach_DAF_XF_480_SSC_MIN-xxl-35481/35481_393188696625.jpg",
];

const MOCK_DATA = [
  {
    id: 14,
    car: "MAN TGS 12.250",
    state_number: "025 AZQ 01",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 15000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 16000,
        },
        {
          location: "сзади слева внутреннее",
          last_change: "2024-02-03",
          mileage: 17000,
        },
        {
          location: "сзади слева внешнее",
          last_change: "2024-02-03",
          mileage: 18000,
        },
        {
          location: "сзади справа внутреннее",
          last_change: "2024-02-03",
          mileage: 19000,
        },
        {
          location: "сзади справа внешнее",
          last_change: "2024-02-03",
          mileage: 20000,
        },
      ],
      engine: { last_change: "2024-02-03", mileage: 18000 },
    },
  },
  {
    id: 15,
    car: "ГАЗ NEXT",
    state_number: "754 АМ 977",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 12000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 11000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 13000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 14000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 15000 },
    },
  },
  {
    id: 16,
    car: "ГАЗ NEXT",
    state_number: "756 АМ 977",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 13000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 12000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 11000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 10000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 16000 },
    },
  },
  {
    id: 17,
    car: "ВАЛДАЙ",
    state_number: "272 рс 77",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 13000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 14000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 12000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 15000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 17000 },
    },
  },
  {
    id: 18,
    car: "ГАЗЕЛЬ NEXT",
    state_number: "718 ЕХ 799",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 13000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 12000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 11000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 10000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 16000 },
    },
  },
  {
    id: 19,
    car: "ГАЗЕЛЬ NEXT",
    state_number: "718 ТЕ 799",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 12000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 13000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 14000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 15000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 17000 },
    },
  },
  {
    id: 20,
    car: "ГАЗЕЛЬ NEXT",
    state_number: "959 ST 01",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 14000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 15000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 16000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 17000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 18000 },
    },
  },
  {
    id: 21,
    car: "ГАЗЕЛЬ NEXT",
    state_number: "205 ЕК 977",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 13000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 14000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 15000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 16000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 17000 },
    },
  },
  {
    id: 22,
    car: "Lada Largus фургон",
    state_number: "276 УР 799",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 12000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 11000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 10000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 9000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 13000 },
    },
  },
  {
    id: 23,
    car: "Lada Largus фургон",
    state_number: "231 УЕ 799",
    trailer_id: null,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 11000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 12000,
        },
        { location: "сзади слева", last_change: "2024-02-03", mileage: 13000 },
        { location: "сзади справа", last_change: "2024-02-03", mileage: 14000 },
      ],
      engine: { last_change: "2024-02-03", mileage: 15000 },
    },
  },
  {
    id: 1,
    car: "DAF XF 480",
    state_number: "747 CU 01",
    trailer_id: 1,
    params: {
      tires: [
        {
          location: "спереди слева",
          last_change: "2024-02-03",
          mileage: 17000,
        },
        {
          location: "спереди справа",
          last_change: "2024-02-03",
          mileage: 16000,
        },
        {
          location: "сзади слева внутреннее",
          last_change: "2024-02-03",
          mileage: 15000,
        },
        {
          location: "сзади слева внешнее",
          last_change: "2024-02-03",
          mileage: 14000,
        },
        {
          location: "сзади справа внутреннее",
          last_change: "2024-02-03",
          mileage: 13000,
        },
        {
          location: "сзади справа внешнее",
          last_change: "2024-02-03",
          mileage: 12000,
        },
      ],
      engine: { last_change: "2024-02-03", mileage: 18000 },
    },
  },
];
