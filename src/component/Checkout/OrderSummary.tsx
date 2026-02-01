/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import TakaIcon from "../TakaIcon";

interface OrderSummaryProps {
  cartId: number | null;
  subtotal: number;
  total: number;
  surcharge?: number;
  refetch: () => void;
  coupon?: string;
}

const OrderSummary = ({
  cartId,
  subtotal,
  total,
  surcharge,
  refetch,
  coupon,
}: OrderSummaryProps) => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const [code, setCode] = useState(coupon && coupon); // track promo code input
  const [discount, setDiscount] = useState(0); // optional: show discount
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // handle apply coupon
  const handleApplyCoupon = async () => {
    if (!code?.trim()) return toast.error("Please enter a coupon code");

    try {
      const res = await axiosSecure.patch(`/cart/apply-coupon/${cartId}`, {
        code,
      });
      const data = await res.data;

      console.log("Coupon applied:", data);

      // Update UI
      setDiscount(data.discountAmount);
      setAppliedCoupon(data.coupon.code);
      refetch();
      // Optionally update subtotal / total
      // setSubtotal(data.cart.subtotalAtAdd);
      // setTotal(data.cart.total);

      toast.success(
        `Coupon ${data.coupon.code} applied! Discount: ${data.discountAmount}`,
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to apply coupon");
    }
  };

  // handle checkout
  const handleCheckout = () => {
    router.push(`checkout/shipping-address`);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg">Order Summary</h2>
        <span className="text-xs underline cursor-pointer">
          {process.env.NEXT_PUBLIC_PHONE_NUMBER || "Contact Us"}
        </span>
      </div>
      <div className="bg-gray-50 p-6 sticky top-8 border border-gray-200">
        <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="flex items-center gap-1">
              <TakaIcon /> {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-gray-500 italic">TBD</span>
          </div>
          {/* <div className="flex justify-between">
            <span>Handling Surcharge</span>
            <span className="flex items-center gap-1">
              <TakaIcon /> {surcharge.toLocaleString()}
            </span>
          </div> */}
          <div className="flex justify-between font-bold text-base pt-2">
            <span>Total</span>
            <span className="flex items-center gap-1">
              <TakaIcon /> {total.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-[#4a5568] text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-black transition mb-3 cursor-pointer"
        >
          Proceed to Checkout
        </button>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <details className="cursor-pointer group" open={!!coupon}>
            <summary className="text-sm font-medium flex justify-between items-center list-none outline-none">
              Promo Code{" "}
              <span className="group-open:rotate-45 transition-transform text-lg">
                +
              </span>
            </summary>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                className="border border-gray-200 flex-1 p-2 text-sm outline-none"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                // disabled={!!appliedCoupon} // optional: disable input if applied
              />
              <button
                onClick={handleApplyCoupon}
                className="border border-black px-4 py-2 text-xs uppercase font-bold hover:bg-black hover:text-white"
                // disabled={!!appliedCoupon} // optional: disable button if applied
              >
                Apply
              </button>
            </div>
            {coupon && (
              <p className="mt-2 text-green-600 text-sm">
                Coupon "{coupon}" applied! Discount: <TakaIcon />{" "}
                {discount.toLocaleString()}
              </p>
            )}
          </details>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
