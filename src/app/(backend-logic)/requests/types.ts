import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";

export type AdjustedRequestDTO = ClientRequestTypeDTO & { trip_id: number };
