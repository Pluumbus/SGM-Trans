"use server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function createClerkSupabaseClient() {
  const clerkAuth = auth();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = (await clerkAuth).getToken({
            template: "SGM-TRANS",
          });

          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}

const supabase = createClerkSupabaseClient();

export default supabase;
