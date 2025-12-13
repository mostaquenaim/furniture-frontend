'use client';

import { useEffect, useState } from 'react';
import PromoBannerCarousel from './PromoBannerCarousel';
import type { PromoBanner } from '@/types/promo-banner';
import useAxiosPublic from '@/hooks/useAxiosPublic';

export default function PromoBannerContainer() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosPublic.get('/promo-banners');
        setBanners(res.data);
      } catch (err) {
        console.error('Failed to load promo banners', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading || banners.length === 0) return null;

  return <PromoBannerCarousel banners={banners} />;
}
