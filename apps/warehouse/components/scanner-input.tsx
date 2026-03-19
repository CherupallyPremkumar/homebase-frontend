'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Input, Button } from '@homebase/ui';
import { ScanBarcode } from 'lucide-react';

interface ScannerInputProps {
  onScan: (code: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ScannerInput({
  onScan,
  placeholder = 'Scan barcode or type SKU...',
  autoFocus = true,
  disabled = false,
  className,
}: ScannerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed) {
      onScan(trimmed);
      setValue('');
      inputRef.current?.focus();
    }
  }, [value, onScan]);

  return (
    <div className={`flex gap-2 ${className ?? ''}`}>
      <div className="relative flex-1">
        <ScanBarcode className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="scanner-input pl-11"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        size="lg"
        className="touch-target px-6"
      >
        Go
      </Button>
    </div>
  );
}
