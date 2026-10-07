import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";
/**
 * Cookie-aware Supabase client for Server Components, Server Functions and
 * Route Handlers. Use this once there is a signed-in user to keep track of;
 * for public catalogue data use ./public, which needs no request.
 * `cookies()` is async in Next 16, so this must be awaited per request — never
 * hoist the result into a module-level singleton.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl(), supabaseKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. Harmless when only reading;
          // add a root proxy.ts to refresh sessions once auth is in use.
        }
      },
    },
  });
}
