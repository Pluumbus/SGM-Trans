"use server";

import { createClient } from "@supabase/supabase-js";
import { auth, clerkClient } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getSupabaseServer() {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const accessToken = await getToken({ template: "SGM-TRANS" });

  console.log(accessToken);
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export default getSupabaseServer;
