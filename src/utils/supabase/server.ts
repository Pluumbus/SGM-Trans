"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { toast } from "@/components/ui/use-toast";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getSupabaseServer() {
  const { userId, getToken } = auth();
  if (!userId) throw new Error("User not authenticated");

  const accessToken = await getToken({ template: "SGM-TRANS" });

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export default getSupabaseServer;
