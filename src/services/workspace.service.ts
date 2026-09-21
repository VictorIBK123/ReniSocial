import axios from 'axios';
import { useAuth } from '../store/authStore';
import { ApiResponse } from './auth.service';

const API_BASE_URL = 'http://51.75.208.211:1045';

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
  logo_url?: string;
  type: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  owner_id: string;
  slug: string;
  type: string;
  created_at: string;
}

export type CreateWorkspaceResponse = ApiResponse<Workspace>;
export type GetWorkspacesResponse = ApiResponse<Workspace[]>;

/**
 * Creates a new workspace at /api/in/workspaces
 * Sends X-Session-Id in headers using stored or provided user token.
 *
 * @param payload Object containing name, description, logo_url, and type
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

