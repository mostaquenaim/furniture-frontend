/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/* eslint-disable @next/next/no-img-element */

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import LoadingDots from "@/component/Loading/LoadingDS";
import Link from "next/link";

const OrderDetails = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  console.log(orderId);

  const axiosSecure = useAxiosSecure();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await axiosSecure.get(
          `orders/track/${orderId}?details=true`,
        );
        console.log(res.data, "resdata - resdata");
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-serif italic text-gray-500">
          Order not found
        </h2>
        <Link
          href="/orders"
          className="mt-6 text-xs uppercase tracking-widest border-b border-black"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-10 border-b border-gray-100 pb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-2">
            Order Details
          </p>
          <h1 className="text-2xl md:text-3xl font-serif italic text-[#262626]">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-GB")}
          </p>
        </header>

        {/* Status */}
        <div className="mb-10">
          <span className="inline-block text-xs uppercase tracking-widest px-4 py-2 border border-gray-300">
            {order.status}
          </span>
        </div>

        {/* Items */}
        <section className="mb-12">
          <h2 className="text-sm uppercase tracking-widest mb-6">Items</h2>

          <div className="space-y-6">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-5 border-b border-gray-100 pb-6"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-32 object-cover bg-gray-100"
                />

                <div className="flex-1">
                  <h3 className="font-serif text-[15px]">{item.name}</h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-sm mt-3">৳{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Info */}
        <section className="grid md:grid-cols-2 gap-10">
          {/* Shipping */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-4">
              Shipping Address
            </h3>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p>{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.fullAddress}</p>
              <p>{order.shippingAddress?.district}</p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{order.subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{order.deliveryCharge}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                <span>Total</span>
                <span>৳{order.total}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 text-center">
          <Link
            href="/orders"
            className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500"
          >
            Back to orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
