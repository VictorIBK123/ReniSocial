import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ActiveWorkspaceState {
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;
}

export const useActiveWorkspaceStore = create<ActiveWorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      setActiveWorkspaceId: (activeWorkspaceId) => set({ activeWorkspaceId }),
    }),
    {
      name: 'active-workspace-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
