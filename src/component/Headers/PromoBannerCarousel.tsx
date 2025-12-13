'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PromoBanner } from '@/types/promo-banner';

interface PromoBannerCarouselProps {
  banners: PromoBanner[];
}

export default function PromoBannerCarousel({ banners }: PromoBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full py-2 px-4 flex items-center justify-between"
      style={{ backgroundColor: currentBanner.bgColor }}
    >
      {/* Previous Button */}
      {banners.length > 1 && (
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition-opacity z-10"
          aria-label="Previous banner"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Banner Content */}
      <div className="flex-1 text-center px-12">
        <div className="text-white text-sm md:text-base font-medium">
          {currentBanner.text}
          {currentBanner.links && currentBanner.links.length > 0 && (
            <span className="inline-flex gap-4 ml-4">
              {currentBanner.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="underline hover:opacity-80 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.text}
                </a>
              ))}
            </span>
          )}
        </div>
      </div>

      {/* Next Button */}
      {banners.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition-opacity z-10"
          aria-label="Next banner"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5 pb-1">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}