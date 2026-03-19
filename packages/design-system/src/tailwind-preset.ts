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
        primary: colors.primary,
        accent: colors.accent,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        gray: colors.gray,
      },
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
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
