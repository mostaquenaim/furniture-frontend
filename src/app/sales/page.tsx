import FlashSalesComp from "@/component/Sales/FlashSalesComp";

// Set NEXT_PUBLIC_FLASH_SALE_END to an ISO date string to enable the countdown,
// e.g. NEXT_PUBLIC_FLASH_SALE_END="2026-06-30T23:59:59+06:00"
// Leave it unset to show the sales page without a countdown.
const SALE_END = process.env.NEXT_PUBLIC_FLASH_SALE_END ?? null;

export const metadata = {
  title: "Flash Sales | Ondorkotha",
  description: "Limited-time flash sale deals on furniture",
};

export default function SalesPage() {
  return <FlashSalesComp saleEndDate={SALE_END} />;
}
