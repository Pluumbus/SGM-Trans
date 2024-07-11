"use client";

import supabase from "@/utils/supabase/client";

export const getCities = async () => {
  return await supabase.from(`cities`).select("*");
};
export const getCitiesKZ = async () => {
  return await supabase.from(`cities`).select("*").eq("country", "kz");
};
export const getCitiesRU = async () => {
  return await supabase.from(`cities`).select("*").eq("country", "ru");
};
