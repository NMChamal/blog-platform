import useSWR from 'swr';
import useAuthStore from '../store/auth.store';
import { handleError } from '../services/error.service';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetcher = async (url: string, method: string, body?: any) => {
  const { token } = useAuthStore.getState();
  const fullUrl = `${BASE_URL}${url}`;
  console.log('Fetching from:', fullUrl);
  const headers: HeadersInit = {};

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      // Attach extra info to the error object.
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const useApi = (url: string | null) => {
  console.log('useApi called with url:', url);
  const { data, error, isLoading, mutate } = useSWR(url, (url) => fetcher(url, 'GET'));

  const post = (body: any) => fetcher(url!, 'POST', body);
  const put = (body: any) => fetcher(url!, 'PUT', body);
  const del = () => fetcher(url!, 'DELETE');

  return { data, error, isLoading, mutate, post, put, del };
};
