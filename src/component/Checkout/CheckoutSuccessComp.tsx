"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf8f6] px-4">
      <div className="w-full max-w-lg bg-white px-10 py-14 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300">
            <Check size={22} className="text-neutral-800" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-6 font-serif text-2xl tracking-wide text-neutral-900">
          Thank you for your order
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Your order has been received and is being reviewed. Our team will
          contact you shortly to confirm the details.
        </p>

        {/* Order ID */}
        {orderId && (
          <p className="mt-5 text-xs tracking-wider text-neutral-500">
            ORDER NUMBER
            <span className="block mt-1 text-sm font-medium text-neutral-800">
              {orderId}
            </span>
          </p>
        )}

        {/* Divider */}
        <div className="my-8 h-px w-full bg-neutral-200" />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard?activeItem=orders")}
            className="w-full border border-neutral-800 py-2.5 text-sm tracking-wide text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
          >
            VIEW MY ORDERS
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-2.5 text-sm tracking-wide text-neutral-600 transition hover:text-neutral-900"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
