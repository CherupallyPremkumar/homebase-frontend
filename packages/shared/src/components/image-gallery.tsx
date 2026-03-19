'use client';

import { useState, useRef } from 'react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Dialog, DialogContent } from '@homebase/ui';

interface ImageGalleryProps {
  images: { url: string; altText?: string }[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!images.length) return null;

  const scrollToIndex = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.children[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main image - scrollable on mobile */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-0 overflow-x-auto scrollbar-hide md:block"
        onScroll={(e) => {
          const target = e.currentTarget;
          const index = Math.round(target.scrollLeft / target.offsetWidth);
          setActiveIndex(index);
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="aspect-square w-full flex-shrink-0 snap-center cursor-zoom-in"
            onClick={() => setZoomOpen(true)}
          >
            <img
              src={img.url}
              alt={img.altText || `Product image ${i + 1}`}
              className="h-full w-full rounded-lg object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={cn(
                'h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                i === activeIndex ? 'border-primary' : 'border-transparent',
              )}
            >
              <img
                src={img.url}
                alt={img.altText || `Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom dialog */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl p-0">
          <img
            src={images[activeIndex]?.url}
            alt={images[activeIndex]?.altText || 'Zoomed product image'}
            className="h-auto w-full"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
