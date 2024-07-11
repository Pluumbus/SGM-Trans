/* eslint-disable prettier/prettier */

import supabase from "@/utils/supabase/client"
import { CargoType } from "../types"
import { TripType } from "../TripCard/TripCard"

export const addWeek = () => {
    
}
export const addTrip = async (data: TripType) => {
    return await supabase.from("trips").insert(data)
}
export const addCargo = async (data: CargoType) => {
    return await supabase.from("cargos").insert(data)
}