/* eslint-disable @next/next/no-img-element */
"use client";

import { InfoIcon } from "lucide-react";
import Title from "../Headers/Title";
import TakaIcon from "../TakaIcon";
import ShowProductsFlex from "../ProductDisplay/ShowProductsFlex";

// Mock Data - In a real app, this might come from a Context or API
const cartData = [
  {
    id: 1,
    name: 'Selma Fransois Tapestry 90" Sofa',
    style: "99122321",
    color: "Fransois",
    size: '90"',
    price: 3598.0,
    quantity: 1,
    image: "/api/placeholder/100/130",
  },
  {
    id: 2,
    name: "Velvet Accent Chair",
    style: "88233412",
    color: "Emerald",
    size: "Standard",
    price: 1200.0,
    quantity: 2,
    image: "/api/placeholder/100/130",
  },
];

// Mock for "You may also like" section
const recommendedProducts = [
  /* ... your product objects ... */
];

const CartPageComponent = () => {
  // Logic to calculate totals dynamically
  const subtotal = cartData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const handlingSurcharge = 20.0;
  const total = subtotal + handlingSurcharge;

  return (
    <div className="max-w-[1500px] mx-auto p-4 lg:p-8 font-sans overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT: Items List */}
        <div className="flex-1 min-w-0">
          <div className="border mb-4 bg-gray-100">
            <div className="px-4 py-4">
              <p className="text-sm text-gray-600 flex gap-2 items-center">
                <InfoIcon size={16} /> The items in your bags may be on sale
                soon. Check it often and start shopping!
              </p>
            </div>
          </div>

          <Title title="Basket" />

          <header className="hidden md:flex border-b border-gray-200 py-2 text-xs uppercase tracking-wider text-gray-500">
            <div className="flex-[2]">Item</div>
            <div className="flex-1 text-center">Item Price</div>
            <div className="flex-1 text-center">Quantity</div>
            <div className="flex-1 text-right">Total Price</div>
          </header>

          {/* Dynamic Mapping of Cart Items */}
          {cartData.map((item) => (
            <CartItemComponent key={item.id} item={item} />
          ))}

          {/* Favorites Section */}
          <div className="mt-16 max-w-full overflow-hidden">
            <Title title="You may also like" />
            <div className="w-full">
              {/* Sending products as parameter */}
              <ShowProductsFlex
                products={recommendedProducts}
                maxWidth="100%"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <aside className="w-full lg:w-96 shrink-0">
          <OrderSummary
            subtotal={subtotal}
            total={total}
            surcharge={handlingSurcharge}
          />
        </aside>
      </div>
    </div>
  );
};

const CartItemComponent = ({ item }) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col md:flex-row py-6 border-b border-gray-200 gap-4 items-start md:items-center">
      {/* Product Image & Info */}
      <div className="flex flex-[2] gap-4 w-full">
        <div className="w-24 h-32 bg-gray-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-sm space-y-1 flex-1">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-gray-600">Style # {item.style}</p>
          <p className="text-gray-600">Color: {item.color}</p>
          <p className="text-gray-600">Size: {item.size}</p>
          <div className="flex gap-4 mt-4 text-xs underline cursor-pointer">
            <span>Remove</span>
            <span>Save for Later</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-1 w-full justify-between md:justify-center items-center text-sm">
        <span className="md:hidden font-semibold">Price:</span>
        <span className="flex items-center">
          <TakaIcon /> {item.price.toLocaleString()}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex flex-1 w-full justify-between md:justify-center items-center">
        <span className="md:hidden text-sm">Qty:</span>
        <select
          className="border p-1 text-sm w-16 bg-transparent"
          defaultValue={item.quantity}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div className="flex flex-1 w-full justify-between md:justify-end items-center font-medium">
        <span className="md:hidden text-sm">Total:</span>
        <span className="flex items-center">
          <TakaIcon /> {itemTotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const OrderSummary = ({ subtotal, total, surcharge }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg">Order Summary</h2>
      <span className="text-xs underline cursor-pointer">
        {process.env.NEXT_PUBLIC_PHONE_NUMBER || "Contact Us"}
      </span>
    </div>
    <div className="bg-gray-50 p-6 sticky top-8 border">
      <div className="space-y-3 text-sm border-b pb-4 mb-4">
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
        <div className="flex justify-between">
          <span>Handling Surcharge</span>
          <span className="flex items-center gap-1">
            <TakaIcon /> {surcharge.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2">
          <span>Total</span>
          <span className="flex items-center gap-1">
            <TakaIcon /> {total.toLocaleString()}
          </span>
        </div>
      </div>

      <button className="w-full bg-[#4a5568] text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-black transition mb-3">
        Proceed to Checkout
      </button>

      <button className="w-full border border-gray-300 py-3 flex justify-center items-center hover:bg-white transition bg-white">
        <span className="text-blue-800 font-extrabold italic">Pay</span>
        <span className="text-blue-500 font-extrabold italic">Pal</span>
      </button>

      <div className="mt-6 border-t pt-4">
        <details className="cursor-pointer group">
          <summary className="text-sm font-medium flex justify-between items-center list-none outline-none">
            Promo Code{" "}
            <span className="group-open:rotate-45 transition-transform text-lg">
              +
            </span>
          </summary>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              className="border flex-1 p-2 text-sm outline-none"
              placeholder="Enter code"
            />
            <button className="border border-black px-4 py-2 text-xs uppercase font-bold hover:bg-black hover:text-white">
              Apply
            </button>
          </div>
        </details>
      </div>
    </div>
  </div>
);

export default CartPageComponent;
