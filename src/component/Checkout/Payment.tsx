/* eslint-disable @next/next/no-img-element */
"use client";

import { CreditCard, Lock, Info } from "lucide-react";
import Title from "../Headers/Title";
import TakaIcon from "../TakaIcon";

const PaymentPageComponent = () => {
  return (
    <div className="max-w-[1500px] mx-auto p-4 lg:p-8 font-sans">
      {/* Checkout Progress Stepper */}
      <div className="flex justify-center items-center mb-12">
        <div className="flex items-center w-full max-w-2xl relative">
          <Step label="Shipment" completed />
          {/* <div className="flex-1 h-[1px] bg-slate-700 mx-2 mt-[-20px]"></div>
          <Step label="Delivery" completed /> */}
          <div className="flex-1 h-[px] bg-slate-700 mx-2 -mt-5"></div>
          <Step label="Payment" active />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT: Payment Form */}
        <div className="flex-1 space-y-8">
          <Title title="Payment" />

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <div className="border p-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  id="cc"
                  defaultChecked
                  className="accent-slate-700"
                />
                <label
                  htmlFor="cc"
                  className="text-sm font-bold uppercase cursor-pointer"
                >
                  Credit Card
                </label>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-white border rounded flex items-center justify-center text-[8px] font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-white border rounded flex items-center justify-center text-[8px] font-bold">
                  MC
                </div>
              </div>
            </div>

            {/* Credit Card Form */}
            <div className="border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="text-xs font-bold uppercase block mb-2">
                    Card Number*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full border p-2 pl-10 outline-none focus:border-gray-400"
                    />
                    <CreditCard
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase block mb-2">
                    Expiration Date*
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full border p-2 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase block mb-2 flex items-center gap-2">
                    CVV*{" "}
                    <Info size={14} className="text-gray-400 cursor-help" />
                  </label>
                  <input
                    type="password"
                    placeholder="XXX"
                    className="w-full border p-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="save-card"
                  className="accent-slate-700"
                />
                <label htmlFor="save-card" className="text-xs text-gray-600">
                  Save card for future purchases
                </label>
              </div>
            </div>

            {/* Alternative Methods */}
            <div className="border p-4 flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                id="paypal"
                className="accent-slate-700"
              />
              <label
                htmlFor="paypal"
                className="text-sm font-bold uppercase cursor-pointer flex items-center gap-2"
              >
                PayPal{" "}
                <span className="text-blue-600 italic lowercase text-[10px]">
                  the safer way to pay
                </span>
              </label>
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="space-y-4">
            <Title title="Billing Address" />
            <div className="border p-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="same-as-shipping"
                  defaultChecked
                  className="accent-slate-700"
                />
                <label
                  htmlFor="same-as-shipping"
                  className="text-sm text-gray-700"
                >
                  Same as shipping address
                </label>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-4 border-dashed border">
            <Lock size={16} />
            <p className="text-[11px]">
              Your payment information is encrypted and processed securely. We
              do not store your full card details.
            </p>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <aside className="w-full lg:w-96 shrink-0">
          <PaymentSummary />
        </aside>
      </div>
    </div>
  );
};

type StepTypeProps = {
  label: string;
  active?: boolean;
  completed?: boolean;
};

const Step = ({ label, active, completed }: StepTypeProps) => (
  <div className="flex flex-col items-center flex-1">
    <div
      className={`w-4 h-4 rounded-full border-2 transition-colors ${
        completed
          ? "bg-slate-700 border-slate-700"
          : active
            ? "bg-white border-slate-700 ring-4 ring-slate-100"
            : "bg-white border-gray-300"
      } z-10`}
    ></div>
    <span
      className={`text-[10px] uppercase mt-2 whitespace-nowrap font-bold ${
        active || completed ? "text-black" : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </div>
);

const PaymentSummary = () => (
  <div className="w-full space-y-6">
    <h2 className="text-lg">Order Summary</h2>

    <div className="bg-white border p-6 space-y-4 text-xs">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span>
          <TakaIcon /> 3,598.00
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping</span>
        <span className="text-green-600 font-medium">FREE</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tax</span>
        <span>
          <TakaIcon /> 0.00
        </span>
      </div>
      <div className="flex justify-between font-bold text-sm border-t pt-4">
        <span>Total</span>
        <span>
          <TakaIcon /> 3,598.00
        </span>
      </div>

      <button className="w-full bg-[#4a5568] text-white py-4 uppercase tracking-[0.2em] font-bold hover:bg-black transition mt-4 flex items-center justify-center gap-2">
        Place Order
      </button>

      <p className="text-[10px] text-gray-400 text-center px-4">
        By clicking &quot;Place Order&quot;, you agree to our Terms of Use and Privacy
        Policy.
      </p>
    </div>

    {/* Order Item Mini-Preview */}
    <div className="border p-4 bg-gray-50">
      <h3 className="text-xs font-bold uppercase mb-3">Review Items</h3>
      <div className="flex gap-3">
        <div className="w-12 h-16 bg-gray-200 shrink-0">
          <img
            src="/api/placeholder/100/130"
            alt="Review"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-[10px]">
          <p className="font-bold truncate w-40">
            Selma Fransois Tapestry 90&quot; Sofa
          </p>
          <p className="text-gray-500 text-[9px]">Qty: 1 • Color: Francois</p>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentPageComponent;
