/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import LoadingDots from "@/component/Loading/LoadingDS";
import Link from "next/link";
import {
  FiStar,
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiCreditCard,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const OrderDetails = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const axiosSecure = useAxiosSecure();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // States for Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await axiosSecure.get(
          `orders/track/${orderId}?details=true`,
        );
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, axiosSecure]);

  const handleOpenReview = (item: any) => {
    setSelectedItem(item);
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!comment.trim()) return toast.error("Please write a comment");
    setSubmittingReview(true);
    try {
      await axiosSecure.post(`/reviews/${selectedItem.id}`, {
        rating,
        comment,
      });
      toast.success("Review submitted successfully!");
      setIsReviewModalOpen(false);
      const res = await axiosSecure.get(`orders/track/${orderId}?details=true`);
      setOrder(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingDots />
      </div>
    );
  if (!order)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        Order not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#262626]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Area */}
        <header className="mb-12 border-b border-gray-100 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
                Order Tracking
              </p>
              <h1 className="text-3xl font-serif italic">
                {order.orderNumber}
              </h1>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <p>Placed: {order.orderDate}</p>
                {order.estimatedDelivery && (
                  <p className="text-black font-medium">
                    • Est. Delivery: {order.estimatedDelivery}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="text-xs uppercase tracking-widest px-4 py-2 border border-black bg-black text-white">
                {order.status}
              </span>
              <span
                className={`text-xs uppercase tracking-widest px-4 py-2 border ${order.payment.status === "PAID" ? "border-green-600 text-green-600" : "border-orange-500 text-orange-500"}`}
              >
                Payment: {order.payment.status}
              </span>
            </div>
          </div>
        </header>

        {/* Order Progress Stepper */}
        <section className="mb-16 bg-white border border-gray-100 p-8">
          <div className="relative flex justify-between">
            {order.trackingEvents.map((event: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col items-center relative z-10 w-full"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-colors duration-500 ${event.completed ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  {event.completed ? (
                    <FiCheckCircle size={16} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
                <p
                  className={`text-[10px] uppercase tracking-tighter font-bold text-center ${event.current ? "text-black" : "text-gray-400"}`}
                >
                  {event.status}
                </p>
                <p className="text-[9px] text-gray-400 mt-1">{event.date}</p>

                {/* Connecting Line */}
                {idx !== order.trackingEvents.length - 1 && (
                  <div
                    className={`absolute top-4 left-[50%] w-full h-[1px] -z-10 ${event.completed ? "bg-black" : "bg-gray-100"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content - Items */}
          <div className="lg:col-span-2">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-6 text-gray-500 border-b border-gray-50 pb-2">
              Purchased Items ({order.items.length})
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-8 flex gap-6 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 object-cover bg-gray-50"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-serif text-lg hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="font-medium">৳{item.subtotal}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] text-gray-500 uppercase tracking-widest">
                        Color: {item.color} | Size: {item.size}
                      </p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-widest font-light">
                        SKU: {item.sku}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Qty: {item.quantity} × ৳{item.price}
                      </p>
                    </div>

                    <div className="mt-6">
                      {order.status === "DELIVERED" || item.isReviewed ? (
                        item.isReviewed ? (
                          <span className="inline-flex items-center gap-2 text-green-600 text-[10px] uppercase tracking-widest font-bold">
                            <FiCheckCircle /> Reviewed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenReview(item)}
                            className="text-[10px] uppercase tracking-widest font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
                          >
                            Write a Review
                          </button>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Summary & Shipping */}
          <div className="space-y-10">
            {/* Payment Info */}
            <div className="bg-[#f9f9f9] p-6 border border-gray-100">
              <h3 className="text-[11px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2 text-gray-500">
                <FiCreditCard /> Payment Information
              </h3>
              <div className="text-xs space-y-3 font-light">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium">{order.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-green-600 font-medium">
                    {order.payment.status}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-[9px] text-gray-400 uppercase mb-1">
                    Transaction ID
                  </p>
                  <p className="break-all font-mono text-[10px]">
                    {order.payment.transactionId}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-6">
              <h3 className="text-[11px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2 text-gray-500">
                <FiTruck /> Shipping Address
              </h3>
              <div className="text-xs space-y-1 leading-relaxed text-gray-600">
                <p className="font-bold text-black uppercase tracking-tighter mb-2">
                  {order.shippingAddress.name}
                </p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p className="uppercase">{order.shippingAddress.district}</p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 bg-[#262626] text-white">
              <h3 className="text-[11px] uppercase tracking-widest font-bold mb-6 opacity-60">
                Order Summary
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex justify-between opacity-80">
                  <span>Subtotal</span>
                  <span>৳{order.subtotal}</span>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>Delivery Charge</span>
                  <span>৳{order.deliveryCharge}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Discount</span>
                    <span>-৳{order.discount}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-white/10 flex justify-between text-base font-serif italic">
                  <span>Grand Total</span>
                  <span>৳{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-serif italic">Review Product</h2>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-4 mb-8 bg-gray-50 p-3">
              <img
                src={selectedItem?.image}
                className="w-16 h-20 object-cover"
                alt=""
              />
              <div>
                <p className="text-sm font-medium">{selectedItem?.name}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-widest block mb-3 text-gray-500">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <FiStar
                      size={24}
                      className={
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="text-[11px] uppercase tracking-widest block mb-3 text-gray-500">
                Your Experience
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the quality and design..."
                className="w-full border-b border-gray-200 focus:border-black outline-none py-2 text-sm resize-none transition-colors"
              />
            </div>

            <button
              disabled={submittingReview}
              onClick={submitReview}
              className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-400"
            >
              {submittingReview ? "Submitting..." : "Post Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
