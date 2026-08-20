/* ==========================================================================
   ReniSocial — Design Tokens
   Single source of truth for every color used across the app.
   ========================================================================== */

export const Colors = {
  // ── Brand ──────────────────────────────────────────────────────────────
  brandPrimary: '#001E88',
  brandDark: '#111827',
  brandNavy: '#111827',

  // ── Core ───────────────────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',

  // ── Surfaces & Backgrounds ─────────────────────────────────────────────
  bgLight: '#F9FAFB',
  bgCardSubtle: '#F9FAFB',
  bgInactive: '#F9FAFB',
  bgAccent: '#EEF2FF',
  bgSecondary: '#F0FDF4',

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
  textMuted: '#64748B',
  textMutedDarker: '#475569',

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

  // ── Shadow ─────────────────────────────────────────────────────────────
  shadow: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
