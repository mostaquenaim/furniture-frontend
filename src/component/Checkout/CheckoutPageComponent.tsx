/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import useFetchCarts from "@/hooks/Cart/useCarts";
import Title from "../Headers/Title";
import TakaIcon from "../TakaIcon";
import OrderSummary from "./OrderSummary";
import { useAuth } from "@/context/AuthContext";
import useFetchDistricts from "@/hooks/Districts/useFetchDistricts";
import LoadingDots from "../Loading/LoadingDS";
import { useEffect, useState } from "react";
import Link from "next/link";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CheckoutPageComponent = () => {
  const { user, loading } = useAuth();

  const {
    districts,
    isLoading: isDistrictLoading,
    error,
  } = useFetchDistricts();

  // console.log(districts);

  const {
    cart,
    isLoading: isCartLoading,
    isFetching,
    refetch,
  } = useFetchCarts({ isSummary: true });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const subtotal = Number(cart?.subtotalAtAdd ?? 0);
  const handlingSurcharge = 0;

  // const [name, setName] = useState("");
  // const [phone, setPhone] = useState("");
  // const [address, setAddress] = useState("");

  // const [selectedDistrictId, setSelectedDistrictId] = useState<number | "">("");
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [isCODAvailable, setIsCODAvailable] = useState(true);

  const total = subtotal + deliveryFee;
  const axiosSecure = useAxiosSecure();
  const router = useRouter();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    districtId: "" as number | "",
    fullAddress: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  // Update useEffect to set user info
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone?.replace("+880", "") || "",
      }));
    }
  }, [user]);

  // loading state
  if (loading || isCartLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingDots />
      </div>
    );
  }

  // user not available
  if (!loading && !user) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-semibold">
            Please sign in to continue checkout
          </h2>
          <p className="text-sm text-gray-600">
            Checkout is available for registered customers only.
          </p>
          <Link
            href={`/login?redirect=cart`}
            className="border border-black px-8 py-3 uppercase text-xs font-bold hover:bg-black hover:text-white transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleConfirmOrder = () => {
    setShowModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!cart?.id) {
      toast.error("Cart not found");
      return;
    }

    if (!address) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);

      if (paymentMethod === "cod") {
        const { data } = await axiosSecure.post(`/orders/create`, {
          cartId: cart.id,
          address,
          paymentMethod: "COD",
        });

        // expect backend to return orderId
        const orderId = data?.orderId;

        toast.success("Order placed successfully!");

        // pass orderId → SUCCESS PAGE
        router.replace(`/checkout/success?orderId=${orderId}`);
        return;
      }

      // ONLINE PAYMENT FLOW (later)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-8 lg:px-8 lg:py-12 font-sans">
      {/* Checkout Progress Stepper */}
      {/* <div className="flex justify-center mb-16">
        <div className="flex items-center w-full max-w-2xl relative">
          <Step label="Shipment" active />
          <div className="flex-1 h-[2px] bg-gray-200 mx-4 relative top-[-20px]"></div>
          <Step label="Payment" active={false} />
        </div>
      </div> */}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
        {/* LEFT: Shipping Form */}
        <div className="flex-1 space-y-8">
          <Title title="Shipping Address" />

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide block mb-3">
                Full Name*
              </label>
              <input
                type="text"
                value={address.name}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 transition-colors"
                placeholder="Your full name"
              />
            </div>

            {/* District */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide block mb-3">
                District*
              </label>
              <select
                value={address.districtId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const district = districts?.find((d) => d.id === id);

                  setAddress((prev) => ({
                    ...prev,
                    districtId: id,
                  }));

                  setDeliveryFee(district?.deliveryFee ?? 0);
                  setIsCODAvailable(district?.isCODAvailable ?? true);

                  // auto-switch to online if COD not allowed
                  if (district && !district.isCODAvailable) {
                    setPaymentMethod("online");
                  }
                }}
              >
                <option value="">Select District</option>
                {districts?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Full Address */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide block mb-3">
                Full Address*
              </label>
              <textarea
                rows={4}
                value={address.fullAddress}
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 transition-colors resize-none"
                placeholder="House, Road, Area"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide block mb-3">
                Phone Number*
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 px-4 py-3 border border-gray-300 bg-gray-50">
                  +880
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[1-9][0-9]{9}"
                  value={address.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.startsWith("0") || value.length > 10) return;
                    setAddress((prev) => ({ ...prev, phone: value }));
                  }}
                  className="flex-1 border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 transition-colors"
                  placeholder="1XXXXXXXXX"
                />
              </div>
            </div>

            {/* payment method */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-bold uppercase tracking-wide">
                Payment Method
              </h4>

              {/* Cash on Delivery */}
              <label
                className={`flex items-center gap-3 cursor-pointer ${
                  !isCODAvailable ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  disabled={!isCODAvailable}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="text-sm">
                  Cash on Delivery
                  {!isCODAvailable && (
                    <span className="block text-xs text-red-500">
                      Not available in this district
                    </span>
                  )}
                </span>
              </label>

              {/* Pay Now */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <span className="text-sm">Pay Now</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        {cart && (
          <aside className="w-full lg:w-[400px] xl:w-[440px] shrink-0">
            <OrderSummary
              cartId={cart?.id}
              subtotal={subtotal}
              total={total}
              cartItems={cart?.items ?? []}
              surcharge={handlingSurcharge}
              refetch={refetch}
              coupon={cart.coupon?.code}
              deliveryFee={deliveryFee}
              isAddressGiven={
                !!(
                  address.name &&
                  address.phone &&
                  address.districtId &&
                  address.fullAddress
                )
              }
              handleConfirmOrder={handleConfirmOrder}
              paymentMethod={paymentMethod}
            />
          </aside>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-[400px] max-w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">Confirm Your Order</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {address.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span> +880{address.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {address.fullAddress}
              </p>
              <p>
                <span className="font-medium">Subtotal:</span> <TakaIcon />{" "}
                {subtotal.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Shipping:</span>{" "}
                {deliveryFee ? <TakaIcon /> : ""} {deliveryFee ?? "TBD"}
              </p>
              <p className="font-bold">
                <span className="font-medium">Total:</span> <TakaIcon /> {total}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="px-4 py-2 bg-[#4a5568] text-white rounded-lg text-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {placingOrder
                  ? "Placing..."
                  : paymentMethod === "cod"
                    ? "Place Order"
                    : "Proceed to payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type StepTypeProps = {
  label: string;
  active: boolean;
};

const Step = ({ label, active }: StepTypeProps) => (
  <div className="flex flex-col items-center relative">
    <div
      className={`w-5 h-5 rounded-full border-2 transition-all ${
        active
          ? "bg-slate-700 border-slate-700 shadow-sm"
          : "bg-white border-gray-300"
      } z-10`}
    ></div>
    <span
      className={`text-[11px] uppercase mt-3 whitespace-nowrap tracking-wider ${
        active ? "text-black font-bold" : "text-gray-400 font-medium"
      }`}
    >
      {label}
    </span>
  </div>
);

export default CheckoutPageComponent;
