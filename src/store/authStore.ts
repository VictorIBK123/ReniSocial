import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  email: string;
  username: string;
  token: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  gender?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  setHydrated: (isHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setHydrated: (isHydrated: boolean) => set({ isHydrated }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Fallback listener in case hydration completed before listener setup
if (useAuthStore.persist?.hasHydrated?.()) {
  useAuthStore.getState().setHydrated(true);
} else {
  const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
    useAuthStore.getState().setHydrated(true);
    unsub?.();
  });
}
