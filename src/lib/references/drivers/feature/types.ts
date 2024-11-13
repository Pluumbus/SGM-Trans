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
  car_type: string;
};
export type TrailersType = {
  id: number;
  trailer: string;
  state_number: string;
  max_weight: number;
  max_volume: number;
};

export type FullDriversType = CarsType & { drivers: DriversType[] } & {
  trailers: TrailersType;
};
export type DriversWithCars = DriversType & { cars: CarsType };
