import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      userId: null,
      isAuthenticated: false,
      setToken: (token) => {
        const decoded = jwtDecode<{ id: string, role: string }>(token);
        set({ token, role: decoded.role, userId: decoded.id, isAuthenticated: true });
      },
      clearAuth: () => {
        set({ token: null, role: null, userId: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
