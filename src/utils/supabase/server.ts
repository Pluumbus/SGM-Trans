"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { getSchema } from "./getSchema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getSupabaseServer() {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const accessToken = await getToken({ template: "SGM-TRANS" });

  return createClient(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: getSchema(),
    },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export default getSupabaseServer;
