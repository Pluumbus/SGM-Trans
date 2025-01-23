export type CarDTOType = {
  id: number;
  car?: string | null;
  state_number?: string | null;
  trailer_id?: number | null;
  car_type: string;
  omnicomm_uuid?: string | null;
  details?: Record<string, unknown> | null;
};
