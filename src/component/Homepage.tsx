/* eslint-disable @next/next/no-img-element */
"use client";

import HomepageBanner from "./Headers/HomepageBanner";
import SeasonalCategory from "./Homepage/SeasonalCategory";
import CategoryNavigation from "./Homepage/CategoryNavigation";
import Title from "./Headers/Title";
import HomepageGallery from "./Homepage/HomepageGallery";
import RecommendedProducts from "./Recommended/RecommendedProducts";
import RecentlyViewedProducts from "./RecentlyViewed/RecentlyViewedProducts";
import FeaturedReview from "./Reviews/FeaturedReview";
import BroadBanner from "./Homepage/BroadBanner";
import TestimonialsSection from "@/hooks/Homepage/Testimonial/Testimonial";
import TrendingProducts from "./Trending/TrendingProducts";
import HomepageFlashSale from "./Sales/HomepageFlashSale";
import UrgencyBanner from "./Homepage/UrgencyBanner";
import FeaturedCategories from "./Homepage/FeaturedCategories";
import AllSeriesGrid from "./Homepage/AllSeriesGrid";
import useFetchSaleStatus from "@/hooks/Homepage/useFetchSaleStatus";

const SALE_END = process.env.NEXT_PUBLIC_FLASH_SALE_END ?? null;

export default function Homepage() {
  const { hasActiveSale, isLoading: saleStatusLoading } = useFetchSaleStatus();

  return (
    <div>
      <div className="min-h-screen bg-white">
        {/* Section 1 — Urgency Banner */}
        <UrgencyBanner />

        {/* Homepage Slider */}
        <HomepageBanner />

        {/* Section 2 — Sale Section (only shown when there are active sale items) */}
        {!saleStatusLoading && hasActiveSale && (
          <HomepageFlashSale saleEndDate={SALE_END} productCount={4} />
        )}

        {/* seasonal categories  */}
        <SeasonalCategory />

        {/* Section 3 — Top Categories Grid (6 curated tiles) */}
        <FeaturedCategories />

        {/* larger device gallery */}
        <div className="hidden lg:block pb-8">
          <HomepageGallery />
        </div>

        {/* larger device gif */}
        <div className="hidden lg:block pb-8">
          <BroadBanner />
        </div>

        {/* small device category navigation */}
        <div className="px-4 md:px-12 lg:px-40 pb-8">
          <CategoryNavigation />
        </div>

        {/* Section 4 — All Categories Grid */}
        <AllSeriesGrid />

        {/* More to Explore */}
        <div className="px-4 md:px-12 lg:px-40 pb-8">
          <Title title="More to Explore" />
          <RecommendedProducts />
        </div>

        {/* Recently viewed products */}
        <div className="px-4 md:px-12 lg:px-40 pb-8">
          <RecentlyViewedProducts />
        </div>

        {/* Testimonial section */}
        <div className="px-4 md:px-12 lg:px-40 pb-8">
          <TestimonialsSection />
        </div>

        {/* Trending Now */}
        <div className="px-4 md:px-12 lg:px-40 pb-8">
          <Title title="Trending Now" />
          <TrendingProducts />
        </div>

        {/* Featured Review */}
        {/* <div className="px-4 md:px-12 lg:px-40 pb-8">
          <FeaturedReview />
        </div> */}
      </div>
    </div>
  );
}
