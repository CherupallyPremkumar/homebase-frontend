import type { Config } from 'tailwindcss';
import { homebasePreset } from '@homebase/design-system/tailwind-preset';

const config: Config = {
  presets: [homebasePreset as Config],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/shared/src/**/*.{ts,tsx}',
  ],
};

export default config;
