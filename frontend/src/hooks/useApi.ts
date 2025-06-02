import { useState, useCallback } from 'react';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface ApiActions<T> {
  request: (url: string, options?: ApiOptions) => Promise<T | null>;
  reset: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useApi<T = any>(): [ApiState<T>, ApiActions<T>] {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const request = useCallback(
    async (url: string, options: ApiOptions = {}): Promise<T | null> => {
      const {
        method = 'GET',
        headers = {},
        body,
        requiresAuth = false,
      } = options;

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Add auth token if required
        const authHeaders = { ...headers };
        if (requiresAuth) {
          const token = localStorage.getItem('adminToken');
          if (token) {
            authHeaders['Authorization'] = `Bearer ${token}`;
          }
        }

        // Prepare request options
        const requestOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        };

        // Add body for non-GET requests
        if (method !== 'GET' && body) {
          requestOptions.body = JSON.stringify(body);
        }

        // Make the request
        const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
        const response = await fetch(fullUrl, requestOptions);

        // Handle non-2xx responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Request failed with status ${response.status}`
          );
        }

        // Parse response
        const data = await response.json();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error : new Error('Unknown error occurred');
        setState({ data: null, loading: false, error: errorMessage as Error });
        return null;
      }
    },
    []
  );

  return [state, { request, reset }];
}