'use client';

interface ProductQuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function ProductQuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
}: ProductQuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="mb-6">
      <p className="mb-3 text-sm font-semibold text-navy-900">Quantity</p>
      <div className="flex items-center">
        <button
          onClick={decrement}
          disabled={value <= min}
          className="flex h-10 w-10 select-none items-center justify-center rounded-l-lg border border-gray-200 text-lg font-medium text-gray-600 transition hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="flex h-10 w-14 items-center justify-center border-b border-t border-gray-200 text-center text-sm font-semibold text-navy-900">
          {value}
        </span>
        <button
          onClick={increment}
          disabled={value >= max}
          className="flex h-10 w-10 select-none items-center justify-center rounded-r-lg border border-gray-200 text-lg font-medium text-gray-600 transition hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}
