import axios from 'axios';
import { useAuth, normalizeUser, UserApiData, User } from '../store/authStore';
import { ApiResponse } from './auth.service';

const API_BASE_URL = 'http://51.75.208.211:1045';

export type UserProfileResponse = ApiResponse<UserApiData | UserApiData[]>;

/**
 * Fetches user profile from /api/in/auth/me
 * Sends X-Session-Id in headers using the stored or provided user token.
 *
 * @param token Optional token override (falls back to stored user token)
 */
export const getUserProfile = async (token?: string): Promise<UserProfileResponse> => {
  const sessionToken =
    token ||
    useAuth.getState().user?.token;

  try {
    console.log('[UserService] getUserProfile called with X-Session-Id:', sessionToken ? `${sessionToken.substring(0, 8)}...` : 'none');
    const response = await axios.request<UserProfileResponse>({
      method: 'GET',
      url: `${API_BASE_URL}/api/in/auth/me`,
      headers: {
        'X-Session-Id': sessionToken || '',
        'Authorization': 'Bearer renisocial',
        'Content-Type': 'application/json',
      },
    });

    console.log('[UserService] getUserProfile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[UserService] getUserProfile error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches user profile from /api/in/auth/me and saves it offline into authStore
 * with full persistence (like sign in and complete registration).
 *
 * @param token Optional token override
 */
export const fetchAndStoreUserProfile = async (token?: string): Promise<User | null> => {
  try {
    const response = await getUserProfile(token);
    if (response.status && response.data) {
      const normalizedProfile = normalizeUser(response.data);
      const existingUser = useAuth.getState().user;

      // Merge: only overwrite fields where the new profile data is non-empty.
      // This preserves login data (e.g. fname/lname) when getUserProfile
      // returns those fields as empty strings or missing.
      let mergedUser: User;
      if (existingUser) {
        mergedUser = { ...existingUser };
        for (const key of Object.keys(normalizedProfile) as (keyof User)[]) {
          const newVal = normalizedProfile[key];
          // Only overwrite if the new value is truthy (not '', null, undefined)
          if (newVal !== '' && newVal !== null && newVal !== undefined) {
            (mergedUser as any)[key] = newVal;
          }
        }
      } else {
        mergedUser = normalizedProfile;
      }

      // Persist to store (which automatically saves to AsyncStorage)
      useAuth.getState().setUser(mergedUser);
      return mergedUser;
    }
    return null;
  } catch (error: any) {
    console.error('[UserService] fetchAndStoreUserProfile error:', error?.response?.data || error.message);
    throw error;
  }
};

// Convenient aliases
export const getMe = getUserProfile;
export const fetchMe = fetchAndStoreUserProfile;
