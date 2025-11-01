import { useState, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  timeout?: number;
}

export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(async (
    endpoint: string,
    options: ApiCallOptions = {}
  ) => {
    const {
      method = 'POST',
      body,
      onSuccess,
      onError,
      successMessage,
      errorMessage = 'Request failed. Please try again.',
      timeout = 30000 // 30 seconds default
    } = options;

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/${endpoint}`,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (successMessage) {
          toast.success(successMessage);
        }
        onSuccess?.(data);
        return data;
      } else {
        throw new Error(data.error || 'Request failed');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      
      let error: Error;
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          error = new Error('Request timed out');
        } else {
          error = err;
        }
      } else {
        error = new Error('Unknown error');
      }
      
      console.error(`${endpoint} error:`, error);
      
      toast.error(error.message === 'Request timed out' ? 'Request timed out. Please try again.' : errorMessage);
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { call, loading, error };
}