"use server";

import { createClient } from "@supabase/supabase-js";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSchema } from "./getSchema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getSupabaseServer() {
  const { userId, getToken, redirectToSignIn } = await auth();
  const user = await currentUser();

  if (!user?.id) redirectToSignIn();

  const accessToken = await getToken({ template: "SGM-PROD" });

  return createClient(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: getSchema(),
    },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export default getSupabaseServer;
