import axios from 'axios';
import { Platform } from 'react-native';
import { useAuth } from '../store/authStore';
import { useActiveWorkspaceStore } from '../store/workspaceStore';
import { ApiResponse } from './auth.service';

const API_BASE_URL = 'http://51.75.208.211:1045';

// ============================================================================
// Types
// ============================================================================

export interface PostItem {
  id: string;
  workspace_id: string;
  author_id?: string;
  content: string;
  article_title?: string;
  article_url?: string;
  media_urls?: string[];
  platforms: string[];
  scheduled_at?: string | null;
  published_at?: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | string;
  fail_reason?: string | null;
  retry_count?: number;
  max_retries?: number;
  current_publish_attempt_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePostPayload {
  workspace_id: string;
  content: string;
  platforms: string[];
  media_urls?: string[];
  article_title?: string;
  article_url?: string;
  scheduled_at?: string;
}

export interface CreatePostResponseData {
  post: PostItem;
}

export type CreatePostResponse = ApiResponse<CreatePostResponseData | PostItem>;

export interface PublishPostResponseData {
  post?: PostItem;
  [key: string]: any;
}

export type PublishPostResponse = ApiResponse<PublishPostResponseData | any>;

export interface PublishPostOptions {
  workspaceId?: string;
  token?: string;
}

export interface GetPostsResponseData {
  limit: number;
  page: number;
  posts: PostItem[];
}

export type GetPostsResponse = ApiResponse<GetPostsResponseData>;

export interface UploadMediaFile {
  uri: string;
  name?: string;
  type?: string;
}

export interface UploadMediaResponseData {
  id: string;
  file_url: string;
  created_at: string;
  user_id: string;
}

export type UploadMediaResponse = ApiResponse<UploadMediaResponseData>;

// ============================================================================
// API Methods
// ============================================================================

/**
 * Uploads media file (image/video) using the workspace media upload endpoint
 * POST /api/in/workspaces/logo-upload
 */
export const uploadPostMedia = async (
  file: UploadMediaFile | FormData,
  token?: string
): Promise<UploadMediaResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;

  let formData: FormData;
  if (file instanceof FormData) {
    formData = file;
  } else {
    formData = new FormData();
    const uri = file.uri;
    const filename = file.name || uri.split('/').pop() || `media_${Date.now()}.jpg`;
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
    console.log('[PostService] uploadPostMedia called');
    const response = await axios.post<UploadMediaResponse>(
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

    console.log('[PostService] uploadPostMedia response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[PostService] uploadPostMedia error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Creates a post for a workspace
 * POST /api/in/posts
 */
export const createPost = async (
  payload: CreatePostPayload,
  token?: string
): Promise<CreatePostResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;

  try {
    console.log('[PostService] createPost called with payload:', payload);
    const response = await axios.request<CreatePostResponse>({
      method: 'POST',
      url: `${API_BASE_URL}/api/in/posts`,
      data: payload,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
    });

    console.log('[PostService] createPost response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[PostService] createPost error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Publishes an existing post immediately
 * POST /api/in/posts/in/{id}/publish?workspace_id={workspace_id}
 */
export const publishPost = async (
  postId: string,
  workspaceIdOrOptions?: string | PublishPostOptions,
  token?: string
): Promise<PublishPostResponse> => {
  let resolvedWorkspaceId: string | undefined;
  let resolvedToken: string | undefined;

  if (typeof workspaceIdOrOptions === 'object' && workspaceIdOrOptions !== null) {
    resolvedWorkspaceId = workspaceIdOrOptions.workspaceId;
    resolvedToken = workspaceIdOrOptions.token;
  } else if (typeof workspaceIdOrOptions === 'string') {
    resolvedWorkspaceId = workspaceIdOrOptions;
    resolvedToken = token;
  } else {
    resolvedToken = token;
  }

  const sessionToken = resolvedToken || useAuth.getState().user?.token;
  const targetWorkspaceId =
    resolvedWorkspaceId || useActiveWorkspaceStore.getState().activeWorkspaceId || undefined;

  try {
    console.log(
      '[PostService] publishPost called for postId:',
      postId,
      'workspace_id:',
      targetWorkspaceId
    );
    const response = await axios.request<PublishPostResponse>({
      method: 'POST',
      url: `${API_BASE_URL}/api/in/posts/in/${postId}/publish`,
      params: targetWorkspaceId ? { workspace_id: targetWorkspaceId } : undefined,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
    });

    console.log('[PostService] publishPost response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[PostService] publishPost error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches the list of posts for a workspace
 * GET /api/in/posts?workspace_id={workspace_id}&page={page}&limit={limit}
 */
export const getPosts = async (
  workspaceId: string,
  options?: { page?: number; limit?: number },
  token?: string
): Promise<GetPostsResponse> => {
  const sessionToken = token || useAuth.getState().user?.token;
  const page = options?.page ?? 0;
  const limit = options?.limit ?? 20;

  const params: Record<string, any> = {
    workspace_id: workspaceId,
    page,
    limit,
  };

  try {
    console.log('[PostService] getPosts called for workspaceId:', workspaceId, 'page:', page, 'limit:', limit);
    const response = await axios.request<GetPostsResponse>({
      method: 'GET',
      url: `${API_BASE_URL}/api/in/posts`,
      params,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
    });

    console.log('[PostService] getPosts response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[PostService] getPosts error:', error?.response?.data || error.message);
    throw error;
  }
};
