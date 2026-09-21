import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../services/user.service';
import { useAuth, normalizeUser, User } from '../store/authStore';

/**
 * TanStack Query hook that fetches the user profile from /api/in/auth/me.
 *
 * - Only enabled when the user is authenticated.
 * - On success, merges the profile data with the existing stored user,
 *   preserving any login fields that the profile endpoint returns as empty.
 * - The query cache is persisted to AsyncStorage via QueryProvider.
 */
export function useUserProfileQuery() {
  const { user, isAuthenticated, setUser } = useAuth();

  const query = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await getUserProfile();
      if (response.status && response.data) {
        return normalizeUser(response.data);
      }
      throw new Error('Failed to fetch user profile');
    },
    enabled: isAuthenticated,
  });

  // Merge profile data with existing user when query succeeds
  useEffect(() => {
    if (!query.data) return;

    const profileData = query.data;
    const existingUser = useAuth.getState().user;

    if (!existingUser) {
      setUser(profileData);
      return;
    }

    // Only overwrite fields where the new profile data is non-empty
    const mergedUser: User = { ...existingUser };
    for (const key of Object.keys(profileData) as (keyof User)[]) {
      const newVal = profileData[key];
      if (newVal !== '' && newVal !== null && newVal !== undefined) {
        (mergedUser as any)[key] = newVal;
      }
    }

    setUser(mergedUser);
  }, [query.data]);

  return query;
}
