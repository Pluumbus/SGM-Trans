"use server";
import { StatsUserList } from "@/lib/references/stats/types";
import getClerkClient from "@/utils/clerk/clerk";
import getSupabaseServer from "@/utils/supabase/server";
import { User } from "@clerk/nextjs/server";

export const getStatsUserList = async () => {
  const users = await (await getClerkClient()).users.getUserList();
  const userList = users.data.map((user: User) => ({
    user_id: user.id,
    userName: user.fullName || "Имя отсутствует",
    avatar: user.imageUrl,
    role: user.publicMetadata?.role as string | undefined,
    value: [],
    created_at: [],
  }));
  const server = getSupabaseServer();
  const { data, error } = await (await server)
    .from("cargos")
    .select(`amount,user_id,created_at`);
  if (error) {
    throw new Error(error.message);
  }
  const userMap = new Map(userList.map((user) => [user.user_id, user]));

  data.forEach((cargo) => {
    const { user_id, amount, created_at } = cargo;

    if (userMap.has(user_id)) {
      const existingUser = userMap.get(user_id);

      if (existingUser!.value) {
        existingUser!.value.push(Number((amount.value as string).replace(/[\s,]/g, '')));
      } else existingUser!.value = [Number((amount.value as string).replace(/[\s,]/g, ''))];

      if (existingUser!.created_at)
        existingUser!.created_at.push(new Date(created_at).toISOString());
      else existingUser!.created_at = [new Date(created_at).toISOString()];
    }
  });

  const fullData = Array.from(userMap.values());
  return fullData as StatsUserList[];
};
