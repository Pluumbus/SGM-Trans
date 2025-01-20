import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";

export type AuditCargosType = {
  id: number;
  created_at: string;
  user_id: string;
  cargo: {
    new: CargoType;
    old: CargoType;
  };
  changed_fields: keyof CargoType[];
  cargo_id: number;
};
