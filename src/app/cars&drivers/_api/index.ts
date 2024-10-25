"use server"
import getSupabaseServer from "@/utils/supabase/server";
import { CarsType, DriversType, FullDriversType, TrailersType } from "./types";
import supabase from "@/utils/supabase/client";

export const getDriversWithCars = async () : Promise<FullDriversType[]> => {
    const server = getSupabaseServer();
    const { data, error } = await (await server)
      .from("cars")
      .select("*,drivers(*), trailers(*)")
  
    if (error ) {
      throw new Error(error.message);
    }
    return data as FullDriversType[];
}


