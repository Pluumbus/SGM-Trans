import supabase from "@/utils/supabase/client";

import { CashboxType } from "../../cashbox/types";

type TM = CashboxType["client"];

export const createClient = async (dataToSet: TM) => {
  const { data, error } = await supabase
    .from("cashbox")
    .insert({ client: dataToSet })
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
