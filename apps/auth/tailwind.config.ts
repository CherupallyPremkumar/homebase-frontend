import type { Config } from 'tailwindcss';
import { homebasePreset } from '@homebase/design-system/tailwind-preset';

const config: Config = {
  presets: [homebasePreset as Config],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        navy: {
          700: '#1E3A5F',
          800: '#1A2E4A',
          900: '#0F1B2D',
        },
      },
    },
  },
};

export default config;
