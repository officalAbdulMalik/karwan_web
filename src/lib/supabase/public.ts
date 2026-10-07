import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";

let client: ReturnType<typeof build> | undefined;

function build() {
  return createSupabaseClient<Database>(supabaseUrl(), supabaseKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Client for public, unauthenticated data. It never touches cookies, so unlike
 * ./server it is usable at build time and inside `generateStaticParams`.
 * Reaches only what the anon role is allowed to by RLS. Safe to share: no
 * session is stored on it.
 */
export function createPublicClient() {
  return (client ??= build());
}
