import { projectId } from './supabase/info';

const LOCAL_API_BASE = '/api';

export function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return LOCAL_API_BASE;
  }
  return `https://${projectId}.supabase.co/functions/v1/make-server-f7922768`;
}

export function getApiUrl(endpoint: string): string {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}`;
}