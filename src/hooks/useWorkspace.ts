import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  createWorkspace,
  CreateWorkspacePayload,
  CreateWorkspaceResponse,
  getWorkspaceMembers,
  getWorkspaces,
  InviteWorkspaceMemberPayload,
  InviteWorkspaceMemberResponse,
  inviteWorkspaceMember,
  removeWorkspaceMember,
  RemoveWorkspaceMemberResponse,
  uploadWorkspaceLogo,
  UploadLogoFile,
  UploadWorkspaceLogoResponse,
  Workspace,
  WorkspaceMember,
  SupportedPlatform,
  PlatformConnection,
  ConnectPlatformResponse,
  DisconnectPlatformResponse,
  getSupportedPlatforms,
  getWorkspaceConnections,
  initiatePlatformConnect,
  disconnectPlatform,
} from '../services/workspace.service';
import { useAuth } from '../store/authStore';

export const WORKSPACES_QUERY_KEY = ['workspaces'] as const;
export const WORKSPACE_MEMBERS_QUERY_KEY = (workspaceId?: string) =>
  ['workspaces', workspaceId || '', 'members'] as const;
export const SUPPORTED_PLATFORMS_QUERY_KEY = ['supported-platforms'] as const;
export const WORKSPACE_CONNECTIONS_QUERY_KEY = (workspaceId?: string) =>
  ['workspaces', workspaceId || '', 'connections'] as const;

import { useActiveWorkspaceStore, type ActiveWorkspaceState } from '../store/workspaceStore';
export { useActiveWorkspaceStore, type ActiveWorkspaceState };

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
 * TanStack Query mutation hook to upload workspace logo at /api/in/workspaces/logo-upload
 */
export function useUploadWorkspaceLogoMutation() {
  return useMutation<UploadWorkspaceLogoResponse, Error, UploadLogoFile | FormData>({
    mutationFn: (file: UploadLogoFile | FormData) => uploadWorkspaceLogo(file),
    onSuccess: (response) => {
      console.log('[useUploadWorkspaceLogoMutation] Logo uploaded successfully:', response);
    },
    onError: (error) => {
      console.error('[useUploadWorkspaceLogoMutation] Failed to upload logo:', error);
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
 
/**
 * TanStack Query hook to fetch workspace members from /api/in/workspaces/in/:id/members
 * NOTE: Data is kept in TanStack Query in-memory cache and intentionally NOT saved to AsyncStorage.
 */
export function useWorkspaceMembersQuery(workspaceId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery<WorkspaceMember[]>({
    queryKey: WORKSPACE_MEMBERS_QUERY_KEY(workspaceId),
    queryFn: async () => {
      if (!workspaceId) return [];
      console.log('[useWorkspaceMembersQuery] Fetching members for workspace:', workspaceId);
      const response = await getWorkspaceMembers(workspaceId);
      if (response.status && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    enabled: isAuthenticated && Boolean(workspaceId),
    meta: {
      persist: false,
    },
  });
}

/**
 * TanStack Query mutation hook to invite/add a member to workspace at /api/in/workspaces/in/:id/members
 */
export function useInviteWorkspaceMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    InviteWorkspaceMemberResponse,
    Error,
    { workspaceId: string; payload: InviteWorkspaceMemberPayload }
  >({
    mutationFn: ({ workspaceId, payload }) => inviteWorkspaceMember(workspaceId, payload),
    onSuccess: (response, variables) => {
      console.log('[useInviteWorkspaceMemberMutation] Member invited successfully:', response);
      // Invalidate and refetch members for this workspace
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_MEMBERS_QUERY_KEY(variables.workspaceId),
      });
    },
    onError: (error) => {
      console.error('[useInviteWorkspaceMemberMutation] Failed to invite member:', error);
    },
  });
}

/**
 * TanStack Query mutation hook to remove a member from workspace at /api/in/workspaces/in/:id/members/in/:userId
 */
export function useRemoveWorkspaceMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    RemoveWorkspaceMemberResponse,
    Error,
    { workspaceId: string; userId: string }
  >({
    mutationFn: ({ workspaceId, userId }) => removeWorkspaceMember(workspaceId, userId),
    onSuccess: (response, variables) => {
      console.log('[useRemoveWorkspaceMemberMutation] Member removed successfully:', response);
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_MEMBERS_QUERY_KEY(variables.workspaceId),
      });
    },
    onError: (error) => {
      console.error('[useRemoveWorkspaceMemberMutation] Failed to remove member:', error);
    },
  });
}

/**
 * TanStack Query hook to fetch supported social platforms from /api/in/platforms
 */
export function useSupportedPlatformsQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery<SupportedPlatform[]>({
    queryKey: SUPPORTED_PLATFORMS_QUERY_KEY,
    queryFn: async () => {
      console.log('[useSupportedPlatformsQuery] Fetching supported platforms');
      const response: any = await getSupportedPlatforms();
      let list: any[] = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (response?.status && Array.isArray(response?.data)) {
        list = response.data;
      }
      return list.map((item) => {
        if (typeof item === 'string') {
          return { id: item, name: item.charAt(0).toUpperCase() + item.slice(1) };
        }
        return item;
      });
    },
    enabled: isAuthenticated,
  });
}

/**
 * TanStack Query hook to fetch connected platforms for a workspace from /api/in/workspaces/in/:id/connections
 */
export function useWorkspaceConnectionsQuery(workspaceId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery<PlatformConnection[]>({
    queryKey: WORKSPACE_CONNECTIONS_QUERY_KEY(workspaceId),
    queryFn: async () => {
      if (!workspaceId) return [];
      console.log('[useWorkspaceConnectionsQuery] Fetching connections for workspace:', workspaceId);
      const response: any = await getWorkspaceConnections(workspaceId);
      let list: any[] = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (response?.status && Array.isArray(response?.data)) {
        list = response.data;
      }
      return list;
    },
    enabled: isAuthenticated && Boolean(workspaceId),
  });
}

/**
 * TanStack Query mutation hook to initiate social platform connection at /api/in/workspaces/in/:id/connect/in/:platform
 * Returns { redirect_url: string }
 */
export function useInitiatePlatformConnectMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ConnectPlatformResponse,
    Error,
    { workspaceId: string; platform: string }
  >({
    mutationFn: ({ workspaceId, platform }) => initiatePlatformConnect(workspaceId, platform),
    onSuccess: (response, variables) => {
      console.log('[useInitiatePlatformConnectMutation] Connect initiated successfully:', response);
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_CONNECTIONS_QUERY_KEY(variables.workspaceId),
      });
    },
  });
}

/**
 * TanStack Query mutation hook to disconnect a platform connection at /api/in/workspaces/in/:id/connections/:connectionId
 */
export function useDisconnectPlatformMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    DisconnectPlatformResponse,
    Error,
    { workspaceId: string; connectionId: string }
  >({
    mutationFn: ({ workspaceId, connectionId }) => disconnectPlatform(workspaceId, connectionId),
    onSuccess: (response, variables) => {
      console.log('[useDisconnectPlatformMutation] Disconnected successfully:', response);
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_CONNECTIONS_QUERY_KEY(variables.workspaceId),
      });
    },
  });
}
