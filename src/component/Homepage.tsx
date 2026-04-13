/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import HomepageBanner from "./Headers/HomepageBanner";
import SeasonalCategory from "./Homepage/SeasonalCategory";
import CategoryNavigation from "./Homepage/CategoryNavigation";
import Title from "./Headers/Title";
import HomepageGallery from "./Homepage/HomepageGallery";
import RecommendedProducts from "./Recommended/RecommendedProducts";
import RecentlyViewedProducts from "./RecentlyViewed/RecentlyViewedProducts";
import FeaturedReview from "./Reviews/FeaturedReview";
import BroadBanner from "./Homepage/BroadBanner";

export default function Homepage() {
  return (
    <div>
      <div className="min-h-screen bg-white">
        {/* Sale Banner */}
        <HomepageBanner />

        {/* seasonal categories  */}
        <SeasonalCategory />

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

        {/* More to Explore */}
        <div className="px-4 md:px-12 lg:px-40 pb-8">
          <Title title="More to Explore" />
          <RecommendedProducts />
        </div>

        {/* Recently viewed products */}
        <div className="px-4 md:px-12 lg:px-40 pb-8">
          <RecentlyViewedProducts />
        </div>

        {/* Featured Review */}
        <div className="px-4 md:px-12 lg:px-40 pb-8">
          <FeaturedReview />
        </div>
      </div>
    </div>
  );
}
