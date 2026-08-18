"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";

export default function MobileAppComingSoon() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#4E5B6D]/10 flex items-center justify-center">
          <Smartphone className="w-9 h-9 text-[#4E5B6D]" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 heading">
            Our Mobile App Is Coming Soon
          </h1>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            We&apos;re working hard to bring you a smoother shopping experience
            right in your pocket. Stay tuned — it&apos;ll be worth the wait.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block text-sm text-gray-500 hover:text-gray-900 hover:underline underline-offset-4"
        >
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
