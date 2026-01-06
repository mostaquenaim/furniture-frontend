/* eslint-disable @next/next/no-img-element */
"use client";

import Title from "../Headers/Title";
import TakaIcon from "../TakaIcon";

const CheckoutPageComponent = () => {
  return (
    <div className="max-w-[1500px] mx-auto p-4 lg:p-8 font-sans">
      {/* Checkout Progress Stepper */}
      <div className="flex justify-center items-center mb-12">
        <div className="flex items-center w-full max-w-2xl relative">
          <Step label="Ship or Pick Up" active />
          <div className="flex-1 h-[1px] bg-gray-300 mx-2 mt-[-20px]"></div>
          <Step label="Delivery" active={false} />
          <div className="flex-1 h-[1px] bg-gray-300 mx-2 mt-[-20px]"></div>
          <Step label="Payment" active={false} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT: Shipping Form */}
        <div className="flex-1 space-y-8">
          {/* Sign In Section */}
          <div className="border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-medium">Already Have An Account?</h2>
              <p className="text-sm text-gray-500">
                Sign in to check out faster.
              </p>
            </div>
            <button className="border border-black px-12 py-2 text-xs uppercase font-bold hover:bg-black hover:text-white transition">
              Sign In
            </button>
          </div>

          {/* Guest Checkout Section */}
          <div className="border p-6 space-y-4">
            <h2 className="text-lg font-medium">Check out as a guest</h2>
            <div className="max-w-md">
              <label className="text-xs font-bold uppercase block mb-2">
                Email Address*
              </label>
              <input
                type="email"
                className="w-full border p-2 outline-none focus:border-gray-400"
              />
            </div>
            <label className="flex items-start gap-3 text-[10px] text-gray-500 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span>
                Please send me Anthropologie offers, promotions, and other
                commercial messages. (You may unsubscribe at any time.)
              </span>
            </label>
          </div>

          {/* Delivery Method Toggle */}
          {/* <div className="flex border">
            <button className="flex-1 py-4 border-r bg-white font-bold text-xs uppercase flex items-center justify-center gap-2 border-b-2 border-b-blue-400">
              <span className="scale-125">📦</span> Ship
            </button>
            <button className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold text-xs uppercase flex items-center justify-center gap-2">
              <span className="grayscale opacity-50">🏬</span> Pick Up
            </button>
          </div> */}

          {/* Shipping Address Form */}
          <div className="space-y-6">
            <Title title="Shipping Address" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label className="text-xs font-bold uppercase block mb-2">
                  Country/Region*
                </label>
                <select className="w-full border p-2 outline-none bg-white">
                  <option>Bangladesh</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-2">
                  First Name*
                </label>
                <input type="text" className="w-full border p-2 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase block mb-2">
                  Last Name*
                </label>
                <input type="text" className="w-full border p-2 outline-none" />
              </div>

              <div className="col-span-full">
                <label className="text-xs font-bold uppercase block mb-2">
                  Street Address*
                </label>
                <input type="text" className="w-full border p-2 outline-none" />
                <p className="text-[10px] text-gray-400 mt-1">
                  35 character limit, continue below.
                </p>
              </div>

              <div className="col-span-full">
                <label className="text-xs font-bold uppercase block mb-2">
                  Address 2
                </label>
                <input
                  type="text"
                  className="w-full border p-2 outline-none"
                  placeholder="Building, Suite or Apartment Number"
                />
              </div>

              <div className="col-span-full flex items-center gap-2">
                <input type="checkbox" id="pobox" />
                <label htmlFor="pobox" className="text-xs text-gray-600">
                  PO Box
                </label>
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-2">
                  City*
                </label>
                <input type="text" className="w-full border p-2 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase block mb-2">
                  Province or Region
                </label>
                <input
                  type="text"
                  className="w-full border p-2 outline-none"
                  placeholder="Province or Region"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-2">
                  Postcode*
                </label>
                <input type="text" className="w-full border p-2 outline-none" />
              </div>

              <div className="col-span-full">
                <label className="text-xs font-bold uppercase block mb-2">
                  Mobile Number*
                </label>
                <div className="flex">
                  <span className="border border-r-0 p-2 bg-gray-50 text-sm flex items-center">
                    +880
                  </span>
                  <input
                    type="tel"
                    className="flex-1 border p-2 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <aside className="w-full lg:w-96 shrink-0">
          <CheckoutSummary />
        </aside>
      </div>
    </div>
  );
};

const Step = ({ label, active }) => (
  <div className="flex flex-col items-center flex-1">
    <div
      className={`w-4 h-4 rounded-full border-2 ${
        active ? "bg-slate-700 border-slate-700" : "bg-white border-gray-300"
      } z-10`}
    ></div>
    <span
      className={`text-[10px] uppercase mt-2 whitespace-nowrap ${
        active ? "text-black font-bold" : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </div>
);

const CheckoutSummary = () => (
  <div className="w-full space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-lg">Order Summary</h2>
      <span className="text-xs underline text-blue-500">800.309.2500</span>
    </div>

    <div className="bg-white border p-6 space-y-4 text-xs">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span>
          <TakaIcon size={12} /> 3,598.00
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping</span>
        <span className="italic">TBD</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Estimated Tax</span>
        <span>
          <TakaIcon size={12} /> 0.00
        </span>
      </div>
      <div className="flex justify-between font-bold text-sm border-t pt-4">
        <span>Total</span>
        <span>
          <TakaIcon size={14} /> 3,598.00
        </span>
      </div>

      <button className="w-full bg-[#4a5568] text-white py-3 uppercase tracking-widest font-bold hover:bg-black transition mt-4">
        Ship to this address
      </button>

      <details className="cursor-pointer group mt-6">
        <summary className="text-xs font-medium flex justify-between items-center list-none outline-none">
          Promo Code{" "}
          <span className="group-open:rotate-45 transition-transform">+</span>
        </summary>
      </details>
    </div>
  </div>
);

export default CheckoutPageComponent;
