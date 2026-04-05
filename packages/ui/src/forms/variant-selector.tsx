'use client';

import { cn } from '../lib/utils';

export interface VariantOption {
  /** Display label for the variant */
  label: string;
  /** Unique value for the variant */
  value: string;
}

export interface VariantSelectorProps {
  /** Array of available variants */
  variants: VariantOption[];
  /** Currently selected variant value */
  selected?: string;
  /** Called when a variant is selected */
  onChange?: (value: string) => void;
  /** Additional class names merged onto the root element */
  className?: string;
}

export function VariantSelector({
  variants,
  selected,
  onChange,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {variants.map((variant) => {
        const isSelected = selected === variant.value;

        return (
          <button
            key={variant.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange?.(variant.value)}
            className={cn(
              'rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all duration-150',
              isSelected
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300'
            )}
          >
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}
