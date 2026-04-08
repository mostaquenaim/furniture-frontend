'use client';

import PromoBannerCarousel from './PromoBannerCarousel';
import useFetchPromoBanners from '@/hooks/Banner/useFetchPromoBanners';

export default function PromoBannerContainer() {
  const { banners, isLoading: loading } = useFetchPromoBanners(true);

  if (loading || banners.length === 0) return null;

  return <PromoBannerCarousel banners={banners} />;
}
