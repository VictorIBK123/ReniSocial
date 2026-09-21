import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserApiData {
  id?: number;
  token?: string;
  usertoken?: string;
  userkey?: string;
  accno?: string;
  mail?: string;
  email?: string;
  username: string;
  username_lock?: string;
  fullname?: string;
  fullName?: string;
  fname?: string;
  firstName?: string;
  first_name?: string;
  lname?: string;
  lastName?: string;
  last_name?: string;
  phone?: string;
  phoneCountryCode?: string;
  country?: string | null;
  gender?: string;
  bvn?: string | null;
  bvn_data?: any;
  nin?: string | null;
  pword?: string | null;
  bankname?: string | null;
  banknumber?: string | null;
  activated?: string;
  timestamp?: string;
  picture?: string;
  picture_name?: string;
  photo?: string | null;
  ref?: string;
  upline?: string;
  credit_score?: string;
  rep?: number;
  ip?: string;
  ip_current?: string;
  address?: string | null;
  addressPhoto?: string | null;
  isBankData?: number;
  isBank_status?: number;
  remind_bvn?: number;
  verified?: number | boolean;
  loginErr?: number;
  blocked?: number;
  pin?: string | null;
  IDType?: string;
  IDNumber?: string;
  IDPhoto?: string | null;
  IDData?: any;
  [key: string]: any;
}

export interface User {
  id?: number | string;
  token: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  gender?: string;
  phone?: string;
  phoneCountryCode?: string;
  country?: string | null;
  photoUrl?: string;
  userkey?: string;
  accno?: string;
  verified?: number | boolean;
  credit_score?: string;
  address?: string | null;
  [key: string]: any;
}

/**
 * Normalizes user data returned from the backend (handling both object and array response shapes,
 * and normalizing email/mail, name, token, and avatar fields).
 *
 * Stores only canonical field names:
 * - firstName / lastName (from fname/lname on login, first_name/last_name on getProfile)
 * - email (from mail or email)
 * - token (from token or usertoken)
 * - photoUrl (from picture, photo, or picture_name)
 */
export const normalizeUser = (apiUser: UserApiData | UserApiData[]): User => {
  const item = Array.isArray(apiUser) ? apiUser[0] : apiUser;
  const token = item.token || item.usertoken || '';
  const email = item.mail || item.email || '';
  const firstName = item.fname || item.first_name || item.firstName || '';
  const lastName = item.lname || item.last_name || item.lastName || '';
  const fullName = item.fullname || item.fullName || `${firstName} ${lastName}`.trim();
  const photoUrl = item.picture || item.photo || item.picture_name || item.avatar_url || '';

  return {
    id: item.id,
    token,
    email,
    username: item.username,
    firstName,
    lastName,
    fullName,
    gender: item.gender,
    phone: item.phone,
    phoneCountryCode: item.phoneCountryCode,
    country: item.country,
    photoUrl,
    userkey: item.userkey,
    accno: item.accno,
    verified: item.verified,
    credit_score: item.credit_score,
    address: item.address,
  };
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  setHydrated: (isHydrated: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setUser: (user) => {
        console.log('[AuthStore] Storing user details:', JSON.stringify(user, null, 2));
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        console.log('[AuthStore] User logged out, cleared from store');
        set({ user: null, isAuthenticated: false });
      },
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
        if (state?.user) {
          console.log('[AuthStore] Rehydrated user details from storage:', JSON.stringify(state.user, null, 2));
        }
      },
    }
  )
);

// Fallback listener in case hydration completed before listener setup
if (useAuth.persist?.hasHydrated?.()) {
  useAuth.getState().setHydrated(true);
} else {
  const unsub = useAuth.persist?.onFinishHydration?.(() => {
    useAuth.getState().setHydrated(true);
    unsub?.();
  });
}

