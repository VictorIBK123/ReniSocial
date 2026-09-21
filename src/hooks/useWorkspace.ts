import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  createWorkspace,
  CreateWorkspacePayload,
  CreateWorkspaceResponse,
  getWorkspaces,
  Workspace,
} from '../services/workspace.service';
import { useAuth } from '../store/authStore';

export const WORKSPACES_QUERY_KEY = ['workspaces'] as const;

// Lightweight store to retain user's chosen active workspace ID across sessions
interface ActiveWorkspaceState {
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

/**
 * TanStack Query hook to fetch the list of workspaces from /api/in/workspaces
 */
export function useWorkspacesQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: WORKSPACES_QUERY_KEY,
    queryFn: async () => {
      console.log('[useWorkspacesQuery] Fetching workspaces from backend...');
      const response = await getWorkspaces();
      if (response.status && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    enabled: isAuthenticated,
  });
}

/**
 * TanStack Query mutation hook to create a workspace at /api/in/workspaces
 */
export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient();
  const setActiveWorkspaceId = useActiveWorkspaceStore((state) => state.setActiveWorkspaceId);

  return useMutation<CreateWorkspaceResponse, Error, CreateWorkspacePayload>({
    mutationFn: (payload: CreateWorkspacePayload) => createWorkspace(payload),
    onSuccess: (response) => {
      console.log('[useCreateWorkspaceMutation] Workspace created successfully:', response);
      if (response.status && response.data?.id) {
        setActiveWorkspaceId(response.data.id);
      }
      // Invalidate and refetch the workspaces query immediately
      queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY });
    },
    onError: (error) => {
      console.error('[useCreateWorkspaceMutation] Failed to create workspace:', error);
    },
  });
}

/**
 * Main workspace hook that provides:
 * - Current workspaces list (fresh from TanStack Query)
 * - Current active workspace
 * - Functions to switch active workspace
 * - Query loading / refetch state
 */
export function useWorkspace() {
  const query = useWorkspacesQuery();
  const { activeWorkspaceId, setActiveWorkspaceId } = useActiveWorkspaceStore();

  const workspaces: Workspace[] = query.data || [];

  const currentWorkspace: Workspace | null = useMemo(() => {
    if (!workspaces.length) return null;
    if (activeWorkspaceId) {
      const found = workspaces.find((w) => w.id === activeWorkspaceId);
      if (found) return found;
    }
    return workspaces[0] || null;
  }, [workspaces, activeWorkspaceId]);

  return {
    ...query,
    workspaces,
    currentWorkspace,
    activeWorkspaceId,
    setActiveWorkspace: (workspace: Workspace | null) => {
      setActiveWorkspaceId(workspace?.id || null);
    },
    setActiveWorkspaceId,
  };
}

export const useWorkspaces = useWorkspace;
