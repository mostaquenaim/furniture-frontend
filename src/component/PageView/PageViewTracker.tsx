"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pushGTMEvent } from "@/lib/gtm";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    pushGTMEvent({
      event: "page_view",
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}