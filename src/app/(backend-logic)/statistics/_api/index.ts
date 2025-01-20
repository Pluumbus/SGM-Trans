"use client";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import { StatsUserList } from "@/lib/references/stats/types";
import getClerkClient from "@/utils/clerk/clerk";
import supabase from "@/utils/supabase/client";
import { User } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";

export type AllCargosByWeek = {
  week_number: number;
  trips: { cargos: { amount: any; user_id: string; is_deleted: boolean }[] }[];
};

export const getAllCargosByWeek = async () => {
  // const users = (
  //   await (await getClerkClient()).users.getUserList({ limit: 99 })
  // ).data;

  // const { data } = useQuery({
  //   queryKey: ["getUsersList"],
  //   queryFn: async () => await getUserList(),
  // });

  // const userList = data.map((user) => ({
  //   user_id: user.id,
  //   userName: user.userName || "Имя отсутствует",
  //   avatar: user.imageUrl,
  //   role: user.role as string | undefined,
  // }));

  const { data: joinData, error: joinError } = await supabase
    .from("weeks")
    .select(`week_number, trips(cargos(amount,user_id, is_deleted))`);

  if (joinError) console.log(joinError.message);

  return {
    data: joinData as AllCargosByWeek[],
    // userList: userList as StatsUserList[],
  };
};
