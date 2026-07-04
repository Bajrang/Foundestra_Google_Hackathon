import { projectId } from './supabase/info';

const LOCAL_API_BASE = '/api';
const CLOUD_FUNCTION_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

export function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return LOCAL_API_BASE;
  }
  if (CLOUD_FUNCTION_BASE?.trim()) {
    return CLOUD_FUNCTION_BASE.replace(/\/$/, '');
  }
  return `https://${projectId}.supabase.co/functions/v1/make-server-f7922768`;
}

export function getApiUrl(endpoint: string): string {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}`;
}