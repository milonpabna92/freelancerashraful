import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  bucketName: string;
  connected: boolean;
}

const STORAGE_KEY = 'ashraful_supabase_config';

export const DEFAULT_SUPABASE_URL = 'https://fzrehlemlorryfgbofyk.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmVobGVtbG9ycnlmZ2JvZnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5OTU4ODksImV4cCI6MjEwNjU3MTg4OX0.qjm49RDeXvA96h_1PEOv39_3NSbA-nM23v01wAbXvrE';

/**
 * Normalizes any Supabase URL format (including dashboard URL or missing protocol)
 * into a valid API endpoint (e.g., https://xyz.supabase.co).
 */
export function normalizeSupabaseUrl(inputUrl?: string): string {
  if (!inputUrl) return DEFAULT_SUPABASE_URL;
  let url = inputUrl.trim();

  // If user pasted a dashboard URL: https://supabase.com/dashboard/project/fzrehlemlorryfgbofyk
  if (url.includes('supabase.com/dashboard/project/')) {
    const match = url.match(/project\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://${match[1]}.supabase.co`;
    }
  }

  // Prepend protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Validate format
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch (e) {}

  return DEFAULT_SUPABASE_URL;
}

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return {
          ...parsed,
          url: normalizeSupabaseUrl(parsed.url),
          anonKey: parsed.anonKey.trim(),
        };
      }
    }
  } catch (e) {}

  return {
    url: normalizeSupabaseUrl((import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL),
    anonKey: ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim(),
    bucketName: 'portfolio_files',
    connected: true,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    const cleanConfig = {
      ...config,
      url: normalizeSupabaseUrl(config.url),
      anonKey: config.anonKey.trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanConfig));
  } catch (e) {}
}

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  const validUrl = normalizeSupabaseUrl(config.url);
  const validKey = (config.anonKey || DEFAULT_SUPABASE_ANON_KEY).trim();

  if (!validUrl || !validKey) {
    return null;
  }

  if (cachedClient && cachedUrl === validUrl && cachedKey === validKey) {
    return cachedClient;
  }

  try {
    // Validate URL object
    new URL(validUrl);

    cachedClient = createClient(validUrl, validKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    cachedUrl = validUrl;
    cachedKey = validKey;
    return cachedClient;
  } catch (err) {
    console.warn('Supabase client initialization skipped:', err);
    return null;
  }
}

/**
 * Tests connection to the provided Supabase project
 */
export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  const cleanUrl = normalizeSupabaseUrl(url);
  const cleanKey = anonKey?.trim();

  if (!cleanUrl || !cleanKey) {
    return { success: false, message: 'Please provide both Supabase URL and Anon Key.' };
  }

  try {
    const client = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    const { error } = await client.auth.getSession();
    if (error && !error.message.includes('Auth session missing')) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'সুপাবেস প্রজেক্টের সাথে সফলভাবে সংযোগ স্থাপিত হয়েছে!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection test failed.' };
  }
}

/**
 * Uploads a file (PDF or Image) to Supabase Storage bucket
 */
export async function uploadFileToSupabase(
  file: File | Blob,
  path: string,
  bucketName = 'portfolio_files'
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  try {
    const { error } = await client.storage
      .from(bucketName)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(path);
    return { success: true, publicUrl: urlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Upload failed' };
  }
}

/**
 * Saves JSON settings into Supabase database (table: portfolio_settings)
 */
export async function saveSettingsToSupabase(settings: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  try {
    const { error } = await client
      .from('portfolio_settings')
      .upsert({
        id: 'main',
        data: settings,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Save failed' };
  }
}

/**
 * Loads JSON settings from Supabase database
 */
export async function loadSettingsFromSupabase(): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  try {
    const { data, error } = await client
      .from('portfolio_settings')
      .select('data')
      .eq('id', 'main')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Load failed' };
  }
}

/**
 * Helper SQL script that user can run in Supabase SQL editor
 */
export const SUPABASE_SETUP_SQL = `-- 1. Create a table for portfolio settings
create table if not exists public.portfolio_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.portfolio_settings enable row level security;

-- Allow public read access to settings
create policy "Allow public read on settings"
  on public.portfolio_settings for select
  using (true);

-- Allow public upsert/write on settings
create policy "Allow public write on settings"
  on public.portfolio_settings for insert
  with check (true);

create policy "Allow public update on settings"
  on public.portfolio_settings for update
  using (true);

-- 2. Create Storage Bucket for CV and Images (if not exists)
insert into storage.buckets (id, name, public)
values ('portfolio_files', 'portfolio_files', true)
on conflict (id) do update set public = true;

-- Allow public read & write access to bucket
create policy "Public Access"
  on storage.objects for select
  using (bucket_id = 'portfolio_files');

create policy "Public Insert"
  on storage.objects for insert
  with check (bucket_id = 'portfolio_files');

create policy "Public Update"
  on storage.objects for update
  using (bucket_id = 'portfolio_files');
`;
