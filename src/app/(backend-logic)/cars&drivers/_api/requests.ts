"use client"

import supabase from "@/utils/supabase/client";

export const updateTrailerData = async (id, value) => {
    const { data, error } = await supabase
    .from("cars")
    .update({ trailer_id: value })
    .eq("id",id);

    if (error) {
        throw new Error();
      }

   return data
  }

export const updateDriverData = async (id, value) => {
  console.log( "id:",id,  "value:",value,)
  const {data, error} = await supabase
    .from("drivers")
    .update({car_id : value})
    .eq("id", id)
    
    if (error) {
      throw new Error();
    }

 return data
}