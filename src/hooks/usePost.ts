import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../store/authStore';
import { useActiveWorkspaceStore } from '../store/workspaceStore';
import {
  createPost,
  publishPost,
  getPosts,
  uploadPostMedia,
  CreatePostPayload,
  CreatePostResponse,
  PublishPostResponse,
  PublishPostOptions,
  GetPostsResponse,
  PostItem,
  UploadMediaFile,
  UploadMediaResponse,
} from '../services/post.service';

export const POST_QUERY_KEYS = {
  all: ['posts'] as const,
  lists: () => [...POST_QUERY_KEYS.all, 'list'] as const,
  list: (workspaceId?: string, page: number = 0, limit: number = 20) =>
    [...POST_QUERY_KEYS.lists(), { workspaceId, page, limit }] as const,
  infinite: (workspaceId?: string, limit: number = 20) =>
    [...POST_QUERY_KEYS.lists(), 'infinite', { workspaceId, limit }] as const,
};

/**
 * TanStack Query hook to fetch posts for a specific workspace.
 * Defaults to 0-indexed page 0 with 20 items limit.
 */
export function usePostsQuery(
  workspaceId?: string | null,
  options?: { page?: number; limit?: number; enabled?: boolean }
) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const token = useAuth((state) => state.user?.token);
  const page = options?.page ?? 0;
  const limit = options?.limit ?? 20;

  return useQuery<PostItem[], Error>({
    queryKey: POST_QUERY_KEYS.list(workspaceId || undefined, page, limit),
    queryFn: async () => {
      if (!workspaceId) return [];
      const res: any = await getPosts(workspaceId, { page, limit }, token);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.posts)) return res.posts;
      if (Array.isArray(res?.data?.posts)) return res.data.posts;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
    enabled: !!workspaceId && isAuthenticated && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * TanStack Query infinite query hook to fetch posts with 0-indexed pagination.
 */
export function useInfinitePostsQuery(
  workspaceId?: string | null,
  options?: { limit?: number; enabled?: boolean }
) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const token = useAuth((state) => state.user?.token);
  const limit = options?.limit ?? 20;

  return useInfiniteQuery<PostItem[], Error>({
    queryKey: POST_QUERY_KEYS.infinite(workspaceId || undefined, limit),
    queryFn: async ({ pageParam = 0 }) => {
      if (!workspaceId) return [];
      const res: any = await getPosts(workspaceId, { page: pageParam as number, limit }, token);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.posts)) return res.posts;
      if (Array.isArray(res?.data?.posts)) return res.data.posts;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < limit) {
        return undefined;
      }
      return allPages.length;
    },
    enabled: !!workspaceId && isAuthenticated && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * TanStack Query mutation to create a new post.
 */
export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const token = useAuth((state) => state.user?.token);

  return useMutation<CreatePostResponse, Error, CreatePostPayload>({
    mutationFn: (payload: CreatePostPayload) => createPost(payload, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.all });
      if (variables.workspace_id) {
        queryClient.invalidateQueries({
          queryKey: POST_QUERY_KEYS.list(variables.workspace_id),
        });
      }
    },
    onError: (error) => {
      console.error('[useCreatePostMutation] Error creating post:', error);
    },
  });
}

export interface PublishPostMutationVariables {
  postId: string;
  workspaceId?: string;
}

/**
 * TanStack Query mutation to publish an existing post.
 */
export function usePublishPostMutation() {
  const queryClient = useQueryClient();
  const token = useAuth((state) => state.user?.token);
  const activeWorkspaceId = useActiveWorkspaceStore((state) => state.activeWorkspaceId);

  return useMutation<PublishPostResponse, Error, string | PublishPostMutationVariables>({
    mutationFn: (variables) => {
      const postId = typeof variables === 'string' ? variables : variables.postId;
      const workspaceId =
        (typeof variables === 'object' ? variables.workspaceId : undefined) ||
        activeWorkspaceId ||
        undefined;
      return publishPost(postId, { workspaceId, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error('[usePublishPostMutation] Error publishing post:', error);
    },
  });
}

/**
 * TanStack Query mutation to upload media for a post.
 */
export function useUploadPostMediaMutation() {
  const token = useAuth((state) => state.user?.token);

  return useMutation<UploadMediaResponse, Error, UploadMediaFile | FormData>({
    mutationFn: (file: UploadMediaFile | FormData) => uploadPostMedia(file, token),
    onError: (error) => {
      console.error('[useUploadPostMediaMutation] Error uploading media:', error);
    },
  });
}
