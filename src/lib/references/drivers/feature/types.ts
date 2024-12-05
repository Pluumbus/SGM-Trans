export type DriversType = {
  id: number;
  name: string;
  car_id: number;
  car_type: string;
  passport_data: { id: string; issued: string; date: string };
};
export type CarsType = {
  id: number;
  car: string;
  state_number: string;
  trailer_id: number;
  car_type: "truck" | "gazell";
  details: CarDetailsType;
  omnicomm_uuid: string;
};

export type SingleDetailType =
  | CarDetailsType["details"][number]
  | WheelType["brake_shoe"]
  | WheelType["wheel"]
  | CarDetailsType["accumulator"]["accumulators"][number];

// TODO: добавить триггер в базу на изменение таблицы Cars, чтобы через тригер сетилось в отдельную табличку с историей

export enum DetailsName {
  Transmission = "КПП",
  Engine = "Двигатель",
  Reducer = "Редуктор",
  SL = "Смазка подвески",
  BL = "Смазка подшибников",
}
export type MileageType = {
  last_mileage: string | number;
  next_mileage: string | number;
};

export type BreakShowType = {
  model: string;
  installation_date: string;
  mileage: MileageType;
};

export type WheelType = {
  brake_shoe: BreakShowType;
  wheel: {
    installation_date: string;
    mileage: MileageType;
  };
};

export type AccumulatorType = {
  model: string;
  mileage: MileageType; // сколько пробег на момент замены
  installation_date: string;
  location: "Верхний" | "Нижний";
};

export type DetailType = {
  installation_date: string;
  name: DetailsName;
  mileage: MileageType;
};

export type CarDetailsType = {
  created_at: string;
  temp_can_mileage?: string;
  details: DetailType[];
  accumulator: {
    last_swap: string;
    accumulators: AccumulatorType[];
  };
  vehicle_axis: VehicleAxis[];
};

export type VehicleAxis = {
  [key in "left" | "right"]: WheelType;
};

export type TrailersType = {
  id: number;
  trailer: string;
  state_number: string;
  max_weight: number;
  max_volume: number;
  details: TrailerDetailsType;
};

export type TrailerDetailsType = {
  vehicle_axis: VehicleAxis[];
};

export type FullDriversType = CarsType & { drivers: DriversType[] };
export type DriversWithCars = DriversType & { cars: CarsType };
