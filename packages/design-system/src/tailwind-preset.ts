import type { Config } from 'tailwindcss';
import { colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { shadows } from './tokens/shadows';
import { radius } from './tokens/radius';

/**
 * Shared Tailwind preset for ALL HomeBase apps.
 *
 * Usage in each app's tailwind.config.ts:
 *   import { homebasePreset } from '@homebase/design-system/tailwind-preset';
 *   export default { presets: [homebasePreset], content: [...] };
 */
export const homebasePreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: { ...colors.primary },
        brand: { ...colors.primary },
        navy: { ...colors.navy },
        admin: { ...colors.admin },
        warehouse: { ...colors.warehouse },
        success: { ...colors.success },
        warning: { ...colors.warning },
        error: { ...colors.error },
        gray: { ...colors.gray },
      },
      fontFamily: {
        sans: [...typography.fontFamily.sans],
        mono: [...typography.fontFamily.mono],
      },
      fontSize: {
        xs: [typography.fontSize.xs[0], { ...typography.fontSize.xs[1] }],
        sm: [typography.fontSize.sm[0], { ...typography.fontSize.sm[1] }],
        base: [typography.fontSize.base[0], { ...typography.fontSize.base[1] }],
        lg: [typography.fontSize.lg[0], { ...typography.fontSize.lg[1] }],
        xl: [typography.fontSize.xl[0], { ...typography.fontSize.xl[1] }],
      },
      fontWeight: { ...typography.fontWeight },
      borderRadius: {
        sm: radius.sm,
        DEFAULT: radius.md,
        md: radius.md,
        lg: radius.lg,
        full: radius.full,
      },
      boxShadow: {
        sm: shadows.sm,
        DEFAULT: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
      },
    },
  },
};
