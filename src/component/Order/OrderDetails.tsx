/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import LoadingDots from "@/component/Loading/LoadingDS";
import Link from "next/link";
import { FiStar, FiCheckCircle } from "react-icons/fi";
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
        console.log(res.data, "order");
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
    console.log(item, 'selected');
    setSelectedItem(item);
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!comment.trim()) return toast.error("Please write a comment");

    setSubmittingReview(true);
    try {
      await axiosSecure.post(`/reviews/${selectedItem.id}`, {
        // orderId: order.id,
        // productId: selectedItem.productId, // Ensure your item object has productId
        rating,
        comment,
      });
      toast.success("Review submitted successfully!");
      setIsReviewModalOpen(false);
      // Refresh order data to update "Reviewed" status
      const res = await axiosSecure.get(`orders/track/${orderId}?details=true`);
      setOrder(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

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
    <div className="min-h-screen bg-[#fffdfa] text-[#262626]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-10 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
              Order Details
            </p>
            <h1 className="text-3xl font-serif italic">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Placed on {order.orderDate}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest font-medium text-gray-400">
              Status
            </span>
            <span className="text-xs uppercase tracking-widest px-4 py-1.5 border border-[#262626] bg-[#262626] text-white">
              {order.status}
            </span>
          </div>
        </header>

        {/* Items Section */}
        <section className="mb-16">
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-8 text-gray-500 border-b border-gray-50 pb-2">
            Purchased Items
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="py-8 flex flex-col sm:flex-row gap-8 first:pt-0"
              >
                <div className="relative group overflow-hidden w-28 h-36 bg-gray-50 border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link href={`/products/${item.slug}`} className="font-serif text-lg leading-snug">
                        {item.name}
                      </Link>
                      <p className="text-sm font-medium">৳{item.subtotal}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                      Qty: {item.quantity} &nbsp; | &nbsp; Price: ৳{item.price}
                    </p>
                  </div>

                  {/* Review Logic */}
                  <div className="mt-6">
                    {order.status === "DELIVERED" ||
                    order.status === "Completed" ? (
                      item.isReviewed ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <FiCheckCircle size={14} />
                          <span className="text-[10px] uppercase tracking-widest font-semibold">
                            Reviewed
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenReview(item)}
                          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold border border-black px-4 py-2 hover:bg-black hover:text-white transition-all duration-300"
                        >
                          <FiStar size={12} /> Write a Review
                        </button>
                      )
                    ) : (
                      <p className="text-[10px] italic text-gray-400">
                        Review available after delivery
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Info Grid */}
        <section className="grid md:grid-cols-2 gap-16 border-t border-gray-100 pt-12">
          {/* Shipping */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-6 text-gray-500">
              Shipping Details
            </h3>
            <div className="text-sm text-gray-600 space-y-2 font-light tracking-wide leading-relaxed">
              <p className="font-medium text-[#262626] uppercase text-xs tracking-widest">
                {order.shippingAddress?.name}
              </p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.district}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#f9f9f9] p-8">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-6 text-gray-500">
              Financial Summary
            </h3>
            <div className="space-y-4 text-sm font-light">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Fee</span>
                <span>৳{order.deliveryCharge}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-red-500 italic">
                  <span>Discount Applied</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-lg">
                <span className="font-serif">Total Amount</span>
                <span>৳{order.total}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-20 text-center">
          <Link
            href="/dashboard?activeItem=orders"
            className="text-[10px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-gray-400 transition-colors"
          >
            Return to Orders
          </Link>
        </div>
      </div>

      {/* --- Review Modal UI --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
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
