import axios from 'axios';
import { Platform } from 'react-native';
import { useAuth } from '../store/authStore';
import { ApiResponse } from './auth.service';

const API_BASE_URL = 'http://51.75.208.211:1045';

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
  logo_id?: string;
  type: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  logo_id?: string;
  owner_id: string;
  slug: string;
  type: string;
  created_at: string;
}

export interface UploadWorkspaceLogoData {
  created_at: string;
  file_url: string;
  id: string;
  user_id: string;
}

export interface UploadLogoFile {
  uri: string;
  name?: string;
  type?: string;
}

export type UploadWorkspaceLogoResponse = ApiResponse<UploadWorkspaceLogoData>;
export type CreateWorkspaceResponse = ApiResponse<Workspace>;
export type GetWorkspacesResponse = ApiResponse<Workspace[]>;

export type WorkspaceRole = 'owner' | 'admin' | 'member';

export interface InviteWorkspaceMemberPayload {
  email: string;
  role: WorkspaceRole;
}

export interface WorkspaceMember {
  id?: string;
  workspace_id?: string;
  user_id?: string;
  role?: WorkspaceRole | string;
  email?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export type GetWorkspaceMembersResponse = ApiResponse<WorkspaceMember[]>;
export type InviteWorkspaceMemberResponse = ApiResponse<any>;
export type RemoveWorkspaceMemberResponse = ApiResponse<any>;

/**
 * Uploads workspace logo at /api/in/workspaces/logo-upload
 * Form field: file
 *
 * @param file UploadLogoFile (uri, name, type) or FormData instance
 * @param token Optional session token override
 */
export const uploadWorkspaceLogo = async (
  file: UploadLogoFile | FormData,
  token?: string
): Promise<UploadWorkspaceLogoResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;

  let formData: FormData;
  if (file instanceof FormData) {
    formData = file;
  } else {
    formData = new FormData();
    const uri = file.uri;
    const filename = file.name || uri.split('/').pop() || 'workspace_logo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = file.type || (match ? `image/${match[1]}` : 'image/jpeg');

    if (Platform.OS === 'web') {
      const res = await fetch(uri);
      const blob = await res.blob();
      formData.append('file', blob, filename);
    } else {
      formData.append('file', {
        uri,
        name: filename,
        type: mimeType,
      } as any);
    }
  }

  try {
    console.log('[WorkspaceService] uploadWorkspaceLogo called');
    const response = await axios.post<UploadWorkspaceLogoResponse>(
      `${API_BASE_URL}/api/in/workspaces/logo-upload`,
      formData,
      {
        headers: {
          'X-Session-Id': sessionToken || '',
          'Authorization': 'Bearer renisocial',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('[WorkspaceService] uploadWorkspaceLogo response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[WorkspaceService] uploadWorkspaceLogo error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Creates a new workspace at /api/in/workspaces
 * Sends X-Session-Id in headers using stored or provided user token.
 *
 * @param payload Object containing name, description, logo_id, and type
 * @param token Optional session token override
 */
export const createWorkspace = async (
  payload: CreateWorkspacePayload,
  token?: string
): Promise<CreateWorkspaceResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;

  try {
    console.log('[WorkspaceService] createWorkspace called:', payload);
    const response = await axios.request<CreateWorkspaceResponse>({
      method: 'POST',
      url: `${API_BASE_URL}/api/in/workspaces`,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
      data: payload,
    });

    console.log('[WorkspaceService] createWorkspace response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[WorkspaceService] createWorkspace error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches the list of workspaces at GET /api/in/workspaces
 * Sends X-Session-Id in headers using stored or provided user token.
 *
 * @param token Optional session token override
 */
export const getWorkspaces = async (
  token?: string
): Promise<GetWorkspacesResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;

  try {
    console.log('[WorkspaceService] getWorkspaces called');
    const response = await axios.request<GetWorkspacesResponse>({
      method: 'GET',
      url: `${API_BASE_URL}/api/in/workspaces`,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
    });

    console.log('[WorkspaceService] getWorkspaces response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[WorkspaceService] getWorkspaces error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches workspace members at GET /api/in/workspaces/in/:id/members
 * Sends X-Session-Id in headers using stored or provided user token.
 *
 * @param workspaceId ID of the workspace
 * @param token Optional session token override
 */
export const getWorkspaceMembers = async (
  workspaceId: string,
  token?: string
): Promise<GetWorkspaceMembersResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;

  try {
    console.log('[WorkspaceService] getWorkspaceMembers called for workspace:', workspaceId);
    const response = await axios.request<GetWorkspaceMembersResponse>({
      method: 'GET',
      url: `${API_BASE_URL}/api/in/workspaces/in/${workspaceId}/members`,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
    });

    console.log('[WorkspaceService] getWorkspaceMembers response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[WorkspaceService] getWorkspaceMembers error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Invites a member to a workspace at POST /api/in/workspaces/in/:id/members
 * Sends X-Session-Id in headers using stored or provided user token.
 *
 * @param workspaceId ID of the workspace
 * @param payload Object containing email and role ('owner' | 'admin' | 'member')
 * @param token Optional session token override
 */
export const inviteWorkspaceMember = async (
  workspaceId: string,
  payload: InviteWorkspaceMemberPayload,
  token?: string
): Promise<InviteWorkspaceMemberResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;

  try {
    console.log('[WorkspaceService] inviteWorkspaceMember called for workspace:', workspaceId, payload);
    const response = await axios.request<InviteWorkspaceMemberResponse>({
      method: 'POST',
      url: `${API_BASE_URL}/api/in/workspaces/in/${workspaceId}/members`,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
      data: payload,
    });

    console.log('[WorkspaceService] inviteWorkspaceMember response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[WorkspaceService] inviteWorkspaceMember error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Removes a member from a workspace at DELETE /api/in/workspaces/in/:id/members/in/:userId
 * Sends X-Session-Id in headers using stored or provided user token.
 *
 * @param workspaceId ID of the workspace
 * @param userId ID of the user/member to remove
 * @param token Optional session token override
 */
export const removeWorkspaceMember = async (
  workspaceId: string,
  userId: string,
  token?: string
): Promise<RemoveWorkspaceMemberResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;

  try {
    console.log('[WorkspaceService] removeWorkspaceMember called for workspace:', workspaceId, 'userId:', userId);
    const response = await axios.request<RemoveWorkspaceMemberResponse>({
      method: 'DELETE',
      url: `${API_BASE_URL}/api/in/workspaces/in/${workspaceId}/members/in/${userId}`,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
    });

    console.log('[WorkspaceService] removeWorkspaceMember response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[WorkspaceService] removeWorkspaceMember error:', error?.response?.data || error.message);
    throw error;
  }
};

