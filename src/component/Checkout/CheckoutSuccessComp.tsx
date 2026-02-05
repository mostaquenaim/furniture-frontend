"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-sm border">
        <CheckCircle className="mx-auto text-green-600" size={56} />

        <h1 className="mt-4 text-xl font-semibold">
          Order placed successfully
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Thank you for your order. We’ll contact you shortly for confirmation.
        </p>

        {orderId && (
          <p className="mt-3 text-sm">
            <span className="text-gray-500">Order ID:</span>{" "}
            <span className="font-medium">{orderId}</span>
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push("/orders")}
            className="w-full rounded-md bg-black text-white py-2 text-sm hover:opacity-90"
          >
            View My Orders
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full rounded-md border py-2 text-sm hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
