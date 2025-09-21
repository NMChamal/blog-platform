import useAuthStore from '../store/auth.store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetcher = async (url: string, method: string, body?: any) => {
  const { token } = useAuthStore.getState();
  const fullUrl = `${BASE_URL}${url}`;
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

    if (res.status === 204) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const useDeleteApi = (url: string) => {
  const del = () => fetcher(url, 'DELETE');

  return { del };
};
