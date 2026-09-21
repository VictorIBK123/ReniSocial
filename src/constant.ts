/* ==========================================================================
   ReniSocial — Design Tokens
   Single source of truth for every color used across the app.
   ========================================================================== */

export const LightColors = {
  // ── Brand ──────────────────────────────────────────────────────────────
  brandPrimary: '#001E88',
  brandDark: '#111827',
  brandNavy: '#111827',

  // ── Core ───────────────────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',

  // ── Surfaces & Backgrounds ─────────────────────────────────────────────
  bgApp: '#F8F9FA',
  bgLight: '#F9FAFB',
  bgCard: '#FFFFFF',
  bgCardSubtle: '#F9FAFB',
  bgInactive: '#F9FAFB',
  bgAccent: '#EEF2FF',
  bgSecondary: '#F0FDF4',
  bgHighlight: '#DBEAFE',

  // ── Glass / Translucent ────────────────────────────────────────────────
  glass06: 'rgba(255, 255, 255, 0.06)',
  glass08: 'rgba(255, 255, 255, 0.08)',
  glass09: 'rgba(255, 255, 255, 0.09)',
  glass12: 'rgba(255, 255, 255, 0.12)',
  glass14: 'rgba(255, 255, 255, 0.14)',
  glass15: 'rgba(255, 255, 255, 0.15)',
  glass18: 'rgba(255, 255, 255, 0.18)',
  glass35: 'rgba(255, 255, 255, 0.35)',
  glass40: 'rgba(255, 255, 255, 0.4)',
  glass65: 'rgba(255, 255, 255, 0.65)',
  glass85: 'rgba(255, 255, 255, 0.85)',
  glass90: 'rgba(255, 255, 255, 0.9)',

  // ── Text ───────────────────────────────────────────────────────────────
  textDark: '#111827',
  textLight: '#FFFFFF',
  textMuted: '#64748B',
  textMutedDarker: '#475569',
  textPlaceholder: '#94A3B8',

  // ── Borders ────────────────────────────────────────────────────────────
  borderLight: '#E2E8F0',
  borderSubtle: '#EEF2F6',
  borderAccent: '#E0E7FF',
  borderDashed: '#CBD5E1',
  dotInactive: '#D1D5DB',

  // ── Status ─────────────────────────────────────────────────────────────
  success: '#16A34A',
  successBg: '#DCFCE7',
  successAlt: '#10B981',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  info: '#3B82F6',
  infoBg: '#DBEAFE',

  // ── Social Brands ──────────────────────────────────────────────────────
  instagram: '#E1306C',
  purple: '#8B5CF6',
  purpleBg: '#EDE9FE',
  linkedin: '#0A66C2',
} as const;

export const DarkColors = {
  // ── Brand ──────────────────────────────────────────────────────────────
  brandPrimary: '#3B82F6',
  brandDark: '#0B0F19',
  brandNavy: '#0F172A',

  // ── Core ───────────────────────────────────────────────────────────────
  white: '#0F172A',
  black: '#FFFFFF',

  // ── Surfaces & Backgrounds ─────────────────────────────────────────────
  bgApp: '#0B0F19',
  bgLight: '#111827',
  bgCard: '#1E293B',
  bgCardSubtle: '#151D2E',
  bgInactive: '#1E293B',
  bgAccent: '#1E293B',
  bgSecondary: '#064E3B',
  bgHighlight: '#1E3A8A',

  // ── Glass / Translucent ────────────────────────────────────────────────
  glass06: 'rgba(0, 0, 0, 0.2)',
  glass08: 'rgba(0, 0, 0, 0.3)',
  glass09: 'rgba(0, 0, 0, 0.35)',
  glass12: 'rgba(0, 0, 0, 0.45)',
  glass14: 'rgba(0, 0, 0, 0.5)',
  glass15: 'rgba(0, 0, 0, 0.55)',
  glass18: 'rgba(0, 0, 0, 0.65)',
  glass35: 'rgba(0, 0, 0, 0.75)',
  glass40: 'rgba(0, 0, 0, 0.8)',
  glass65: 'rgba(255, 255, 255, 0.65)',
  glass85: 'rgba(255, 255, 255, 0.85)',
  glass90: 'rgba(255, 255, 255, 0.9)',

  // ── Text ───────────────────────────────────────────────────────────────
  textDark: '#F8FAFC',
  textLight: '#FFFFFF',
  textMuted: '#94A3B8',
  textMutedDarker: '#CBD5E1',
  textPlaceholder: '#64748B',

  // ── Borders ────────────────────────────────────────────────────────────
  borderLight: '#334155',
  borderSubtle: '#1E293B',
  borderAccent: '#1E3A8A',
  borderDashed: '#475569',
  dotInactive: '#4B5563',

  // ── Status ─────────────────────────────────────────────────────────────
  success: '#22C55E',
  successBg: '#052E16',
  successAlt: '#34D399',
  danger: '#F87171',
  dangerBg: '#450A0A',
  warning: '#FBBF24',
  warningBg: '#451A03',
  info: '#60A5FA',
  infoBg: '#172554',

  // ── Social Brands ──────────────────────────────────────────────────────
  instagram: '#F43F5E',
  purple: '#A78BFA',
  purpleBg: '#2E1065',
  linkedin: '#38BDF8',
} as const;

export const Colors = {
  light: LightColors,
  dark: DarkColors,
  // Backward compatibility: default values mapped from light mode
  ...LightColors,
} as const;

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';
export type ThemeColors = Record<keyof typeof LightColors, string>;
export type ColorKey = keyof typeof LightColors;

/* ==========================================================================
   Typography — Font Families
   ========================================================================== */

export const Fonts = {
  // ── Title / Bold Texts ─────────────────────────────────────────────────
  heading: {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    semiBold: 'Outfit_600SemiBold',
    bold: 'Outfit_700Bold',
    extraBold: 'Outfit_800ExtraBold',
  },

  // ── Body Text ──────────────────────────────────────────────────────────
  body: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
    extraBold: 'PlusJakartaSans_800ExtraBold',
  },

  // ── Alt / Stylish Texts ────────────────────────────────────────────────
  alt: {
    regular: 'SpaceGrotesk_400Regular',
    medium: 'SpaceGrotesk_500Medium',
    semiBold: 'SpaceGrotesk_600SemiBold',
    bold: 'SpaceGrotesk_700Bold',
  },
} as const;
