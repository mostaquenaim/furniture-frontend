/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  Home,
  Search,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  image?: string;
  price: number;
}

interface OrderStatus {
  status: string;
  date: string;
  completed: boolean;
  description?: string;
}

interface OrderData {
  orderId: string;
  email: string;
  statusTimeline: OrderStatus[];
  items: OrderItem[];
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  shippingMethod: string;
  trackingNumber?: string;
  totalAmount: number;
}

const mockOrder: OrderData = {
  orderId: "SAK-10234",
  email: "customer@email.com",
  deliveryAddress: "123 Main Street, Dhaka 1205, Bangladesh",
  orderDate: "02 Jan 2026",
  estimatedDelivery: "08 Jan 2026",
  shippingMethod: "Standard Shipping",
  trackingNumber: "TRK-789456123",
  totalAmount: 249.99,
  statusTimeline: [
    {
      status: "Order Placed",
      date: "02 Jan 2026, 10:30 AM",
      completed: true,
      description: "Your order has been received",
    },
    {
      status: "Processing",
      date: "03 Jan 2026, 09:15 AM",
      completed: true,
      description: "Preparing your items",
    },
    {
      status: "Shipped",
      date: "05 Jan 2026, 02:45 PM",
      completed: true,
      description: "Package has left our warehouse",
    },
    {
      status: "Out for Delivery",
      date: "07 Jan 2026, 08:30 AM",
      completed: false,
      description: "Expected delivery today",
    },
    {
      status: "Delivered",
      date: "08 Jan 2026 (Estimated)",
      completed: false,
      description: "Estimated delivery date",
    },
  ],
  items: [
    {
      name: "Teak Wood Lounge Chair",
      qty: 1,
      price: 189.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    },
    {
      name: "Minimal Side Table",
      qty: 2,
      price: 30.0,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
    },
  ],
};

const statusIcons: Record<string, React.ReactNode> = {
  "Order Placed": <CheckCircle className="w-5 h-5" />,
  Processing: <Package className="w-5 h-5" />,
  Shipped: <Truck className="w-5 h-5" />,
  "Out for Delivery": <Truck className="w-5 h-5" />,
  Delivered: <Home className="w-5 h-5" />,
};

const TrackOrder = () => {
  const axiosSecure = useAxiosSecure();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!orderId.trim() || !email.trim()) {
      toast.error("Please enter both order number and email");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosSecure.post("/orders/track", {
        orderId: orderId.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
      });
      setOrder(res.data);
      toast.success("Order found!");
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Order not found. Please check your details.");
        setOrder(mockOrder);
        toast("Showing demo tracking information", {
          icon: "ℹ️",
          duration: 4000,
        });
      } else {
        setOrder(mockOrder);
        toast("Showing demo tracking information", {
          icon: "ℹ️",
          duration: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTrack();
    }
  };

  const getCurrentStatus = () => {
    if (!order) return null;
    const current = order.statusTimeline.find((s) => !s.completed);
    return current || order.statusTimeline[order.statusTimeline.length - 1];
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Track Your Order
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your order details below to check the status of your purchase
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Find Your Order
            </h2>
          </div>

          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAK-10234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Find your order number in your confirmation email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Must match the email used for the order
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Tracking Order...
                </>
              ) : (
                <>
                  Track Order
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Result */}
        {order && (
          <div className="space-y-8 animate-fade-in">
            {/* Status Banner */}
            <div className="bg-linear-to-r from-gray-900 to-black text-white rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Package className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Order Status</h2>
                  </div>
                  <p className="text-gray-300 text-lg">
                    Current Status:{" "}
                    <span className="font-semibold">
                      {currentStatus?.status}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300">Order ID</p>
                  <p className="text-2xl font-mono font-bold">
                    {order.orderId}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Delivery Progress
              </h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200">
                  <div
                    className="absolute top-0 left-0 w-full bg-black transition-all duration-500"
                    style={{
                      height: `${
                        (order.statusTimeline.filter((s) => s.completed)
                          .length /
                          (order.statusTimeline.length - 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>

                {/* Timeline Steps */}
                <div className="relative space-y-8">
                  {order.statusTimeline?.map((step, index) => (
                    <div key={index} className="flex gap-6">
                      <div
                        className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-7 h-7" />
                        ) : (
                          statusIcons[step.status] || (
                            <Clock className="w-7 h-7" />
                          )
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h4
                            className={`text-lg font-medium ${
                              step.completed ? "text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {step.status}
                          </h4>
                          <span
                            className={`text-sm px-3 py-1 rounded-full ${
                              step.completed
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {step.date}
                          </span>
                        </div>
                        {step.description && (
                          <p className="text-gray-500 mt-1">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-6">
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <Package className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-600">Qty: {item.qty}</span>
                          <span className="font-semibold">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Shipping Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Delivery Address
                    </h4>
                    <p className="text-gray-900">{order.deliveryAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Order Date
                      </h4>
                      <p className="text-gray-900">{order.orderDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Estimated Delivery
                      </h4>
                      <p className="text-gray-900 font-medium">
                        {order.estimatedDelivery}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Shipping Method
                      </h4>
                      <p className="text-gray-900">{order.shippingMethod}</p>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Tracking Number
                        </h4>
                        <p className="font-mono text-gray-900">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Need help with your order?
                  </h4>
                  <p className="text-blue-700 mb-4">
                    If you have questions about your delivery or need to make
                    changes, our customer service team is here to help.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                      Contact Support
                    </button>
                    <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm">
                      View Return Policy
                    </button>
                    <button className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                      Order History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
