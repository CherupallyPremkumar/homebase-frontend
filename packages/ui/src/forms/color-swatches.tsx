'use client';

import { cn } from '../lib/utils';

export interface ColorOption {
  /** Display name for the color (e.g. "Midnight Black") */
  name: string;
  /** CSS color value (e.g. "#1F2937", "rgb(31,41,55)", or a Tailwind bg class) */
  value: string;
}

export interface ColorSwatchesProps {
  /** Array of available colors */
  colors: ColorOption[];
  /** Currently selected color value */
  selected?: string;
  /** Called when a color is selected */
  onChange?: (value: string) => void;
  /** Additional class names merged onto the root element */
  className?: string;
}

export function ColorSwatches({
  colors,
  selected,
  onChange,
  className,
}: ColorSwatchesProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {colors.map((color) => {
        const isSelected = selected === color.value;

        return (
          <button
            key={color.value}
            type="button"
            title={color.name}
            aria-label={color.name}
            aria-pressed={isSelected}
            onClick={() => onChange?.(color.value)}
            className={cn(
              'h-8 w-8 rounded-full border-2 transition-all duration-150 hover:scale-110',
              isSelected
                ? 'ring-2 ring-brand-500 ring-offset-2 border-gray-300'
                : 'border-gray-200'
            )}
            style={{ backgroundColor: color.value }}
          />
        );
      })}
    </div>
  );
}
