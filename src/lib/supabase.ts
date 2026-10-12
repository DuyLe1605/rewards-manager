import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = "https://kcbhuprbaenskzrfdpzx.supabase.co";

export function getStoredConfig() {
  const url = localStorage.getItem('rewards_admin_url') || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem('rewards_admin_key') || '';
  return { url, key };
}

export function saveStoredConfig(url: string, key: string) {
  localStorage.setItem('rewards_admin_url', url.trim());
  localStorage.setItem('rewards_admin_key', key.trim());
}

let cachedClient: SupabaseClient | null = null;
let lastKey = '';

export function getSupabase(): SupabaseClient | null {
  const { url, key } = getStoredConfig();
  if (!url || !key) return null;

  if (cachedClient && lastKey === key) {
    return cachedClient;
  }

  cachedClient = createClient(url, key);
  lastKey = key;
  return cachedClient;
}
