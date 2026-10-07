"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";
/** Supabase client for Client Components. Safe to call on every render. */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabaseKey());
}
