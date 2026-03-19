'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Banner } from '@homebase/types';
import { cn } from '@homebase/ui/src/lib/utils';

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0">
            {banner.linkUrl ? (
              <Link href={banner.linkUrl}>
                <img
                  src={banner.imageUrl}
                  alt={banner.altText || banner.title}
                  className="h-48 w-full object-cover sm:h-64 md:h-80 lg:h-96"
                />
              </Link>
            ) : (
              <img
                src={banner.imageUrl}
                alt={banner.altText || banner.title}
                className="h-48 w-full object-cover sm:h-64 md:h-80 lg:h-96"
              />
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                i === active ? 'w-6 bg-white' : 'w-2 bg-white/60',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
