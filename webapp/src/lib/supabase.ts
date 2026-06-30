import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rrxddepuvhovcpkokuck.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyeGRkZXB1dmhvdmNwa29rdWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3ODE1MzcsImV4cCI6MjA4NTM1NzUzN30.mzhLjbajtY0slR-5ki8YmXIoBqYg5S3GccHybKOTe4E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to call Edge Functions with query params
export async function callEdgeFunction<T>(
  functionName: string,
  options?: {
    body?: Record<string, unknown>;
    queryParams?: Record<string, string>;
  }
): Promise<T> {
  let url = `${supabaseUrl}/functions/v1/${functionName}`;

  if (options?.queryParams) {
    const params = new URLSearchParams(options.queryParams);
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: options?.body ? 'POST' : 'GET',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(error.error?.message || 'Request failed');
  }

  const result = await response.json();
  return result.data as T;
}

export { supabaseUrl, supabaseAnonKey };
