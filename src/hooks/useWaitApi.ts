import { useCallback } from 'react';
import { useSpinnerActions } from '../context/SpinnerContext';
import { apiFetch, apiPost } from '../api/client';

export function useApi() {
  const { start, stop } = useSpinnerActions();

  const get = useCallback(
    async <T>(url: string, options?: RequestInit): Promise<T> => {
      start();
      try {
        return await apiFetch<T>(url, options);
      } finally {
        stop();
      }
    },
    [start, stop]
  );

  const post = useCallback(
    async <Body, Res = void>(
      url: string,
      body: Body,
      options?: Omit<RequestInit, 'method' | 'body'>
    ): Promise<Res> => {
      start();
      try {
        return await apiPost<Body, Res>(url, body, options);
      } finally {
        stop();
      }
    },
    [start, stop]
  );

  return { get, post };
}

