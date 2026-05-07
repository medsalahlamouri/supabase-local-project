import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/models";

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function readSupabaseConfig(): SupabaseConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

const supabaseConfig = readSupabaseConfig();

export const supabaseConfigured = supabaseConfig !== null;

if (!supabaseConfigured && import.meta.env.DEV) {
  console.warn(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase: SupabaseClient<Database> | null = supabaseConfig
  ? createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey)
  : null;
