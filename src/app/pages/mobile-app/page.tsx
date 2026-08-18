import type { Metadata } from "next";
import MobileAppComingSoon from "@/component/MobileApp/ComingSoon";

export const metadata: Metadata = {
  title: "Mobile App Coming Soon | Ondorkotha",
  description:
    "Our mobile app is on its way. Sign up to be notified the moment it launches.",
};

export default function MobileAppPage() {
  return <MobileAppComingSoon />;
}
