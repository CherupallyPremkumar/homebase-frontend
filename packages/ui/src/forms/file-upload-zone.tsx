'use client';

import { useCallback, useRef, useState } from 'react';

import { cn } from '../lib/utils';

export interface FileUploadZoneProps {
  /** Accepted file types (e.g. "image/*,.pdf") */
  accept?: string;
  /** Max file size description (e.g. "Max 5MB") */
  maxSize?: string;
  /** Called when files are selected via browse or drop */
  onFileSelect?: (files: FileList) => void;
  /** Additional class names merged onto the root element */
  className?: string;
}

export function FileUploadZone({
  accept,
  maxSize,
  onFileSelect,
  className,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        onFileSelect?.(e.dataTransfer.files);
      }
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect?.(e.target.files);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'rounded-xl border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer transition-all duration-200',
        isDragOver
          ? 'border-brand-500 bg-brand-50'
          : 'hover:border-brand-400 hover:bg-brand-50',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center">
        {/* Upload icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <svg
            className="h-7 w-7 text-brand-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
        </div>

        {/* Primary text */}
        <p className="mb-1 text-sm font-medium text-gray-700">
          Drag &amp; drop files here, or{' '}
          <span className="cursor-pointer font-semibold text-brand-500 hover:underline">
            click to browse
          </span>
        </p>

        {/* Accepted formats / max size hint */}
        {(accept || maxSize) && (
          <p className="text-xs text-gray-400">
            {accept && <span>{accept}</span>}
            {accept && maxSize && ' \u2014 '}
            {maxSize && <span>{maxSize}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
