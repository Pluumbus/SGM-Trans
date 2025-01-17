"use server";
import { StatsUserList } from "@/lib/references/stats/types";
import getClerkClient from "@/utils/clerk/clerk";
import getSupabaseServer from "@/utils/supabase/server";
import { User } from "@clerk/nextjs/server";

export type AllCargosByWeek = {
  week_number: number;
  trips: { cargos: { amount: any; user_id: string; is_deleted: boolean }[] }[];
};

export const getAllCargosByWeek = async () => {
  const users = (
    await (await getClerkClient()).users.getUserList({ limit: 99 })
  ).data;
  const userList = users.map((user: User) => ({
    user_id: user.id,
    userName: user.fullName || "Имя отсутствует",
    avatar: user.imageUrl,
    role: user.publicMetadata?.role as string | undefined,
  }));

  const { data: joinData, error: joinError } = await (await getSupabaseServer())
    .from("weeks")
    .select(`week_number, trips(cargos(amount,user_id, is_deleted))`);

  if (joinError) console.log(joinError.message);

  return {
    data: joinData as AllCargosByWeek[],
    userList: userList as StatsUserList[],
  };
};
