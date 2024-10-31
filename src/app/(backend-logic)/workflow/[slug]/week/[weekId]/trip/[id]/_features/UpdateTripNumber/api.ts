import supabase from "@/utils/supabase/client";

export const updateTripNumber = async (cargoId: number, newTripId: number) => {
  return await supabase
    .from(`cargos`)
    .update({
      trip_id: newTripId,
    })
    .eq("id", cargoId);
};
