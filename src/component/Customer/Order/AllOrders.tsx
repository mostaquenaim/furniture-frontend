"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RotateCcw,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface Order {
  orderId: string;
  date: string;
  status: "delivered" | "shipped" | "processing" | "cancelled";
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  deliveryAddress: string;
  estimatedDelivery?: string;
}

const mockOrders: Order[] = [
  {
    orderId: "SAK-10234",
    date: "Jan 5, 2026",
    status: "delivered",
    total: 1248.0,
    deliveryAddress: "123 Main St, Dhaka, Bangladesh",
    items: [
      {
        id: "1",
        name: "Teak Wood Lounge Chair",
        qty: 1,
        price: 899.0,
        image: "🪑",
      },
      {
        id: "2",
        name: "Minimal Side Table",
        qty: 2,
        price: 174.5,
        image: "🪵",
      },
    ],
    trackingNumber: "TRK789456123",
  },
  {
    orderId: "SAK-10198",
    date: "Dec 28, 2025",
    status: "shipped",
    total: 456.0,
    deliveryAddress: "123 Main St, Dhaka, Bangladesh",
    estimatedDelivery: "Jan 13, 2026",
    items: [
      { id: "3", name: "Ceramic Vase Set", qty: 1, price: 129.0, image: "🏺" },
      {
        id: "4",
        name: "Wool Throw Blanket",
        qty: 1,
        price: 189.0,
        image: "🧶",
      },
      {
        id: "5",
        name: "Brass Candle Holders",
        qty: 2,
        price: 69.0,
        image: "🕯️",
      },
    ],
    trackingNumber: "TRK456789321",
  },
  {
    orderId: "SAK-10145",
    date: "Dec 15, 2025",
    status: "processing",
    total: 2340.0,
    deliveryAddress: "123 Main St, Dhaka, Bangladesh",
    estimatedDelivery: "Jan 20, 2026",
    items: [
      {
        id: "6",
        name: "Velvet Sofa - Navy",
        qty: 1,
        price: 1899.0,
        image: "🛋️",
      },
      {
        id: "7",
        name: "Decorative Pillows",
        qty: 4,
        price: 110.25,
        image: "🛏️",
      },
    ],
  },
  {
    orderId: "SAK-10089",
    date: "Nov 20, 2025",
    status: "delivered",
    total: 315.0,
    deliveryAddress: "123 Main St, Dhaka, Bangladesh",
    items: [
      {
        id: "8",
        name: "Rattan Storage Basket",
        qty: 3,
        price: 105.0,
        image: "🧺",
      },
    ],
    trackingNumber: "TRK123654789",
  },
  {
    orderId: "SAK-10012",
    date: "Oct 8, 2025",
    status: "cancelled",
    total: 678.0,
    deliveryAddress: "123 Main St, Dhaka, Bangladesh",
    items: [
      {
        id: "9",
        name: "Marble Coffee Table",
        qty: 1,
        price: 678.0,
        image: "⬜",
      },
    ],
  },
  {
    orderId: "SAK-09956",
    date: "Sep 22, 2025",
    status: "delivered",
    total: 234.0,
    deliveryAddress: "123 Main St, Dhaka, Bangladesh",
    items: [
      {
        id: "10",
        name: "Glass Dinner Plates Set",
        qty: 1,
        price: 234.0,
        image: "🍽️",
      },
    ],
    trackingNumber: "TRK987321654",
  },
];

const OrderHistoryPage = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const ordersPerPage = 3;

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-gray-700" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-gray-700" />;
      case "processing":
        return <Package className="w-4 h-4 text-gray-700" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-gray-700 border-gray-200";
      case "shipped":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "processing":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-gray-50 text-gray-400 border-gray-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-medium mb-1.5 tracking-tight text-gray-900">
          Order History
        </h1>
        <p className="text-sm text-gray-500">
          View and manage your past orders
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center sm:justify-start text-gray-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <label className="block text-xs font-medium mb-3 text-gray-700 uppercase tracking-wide">
              Order Status
            </label>
            <div className="flex flex-wrap gap-2">
              {["all", "delivered", "shipped", "processing", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filterStatus === status
                        ? "bg-gray-900 text-white"
                        : "bg-white border border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-3 mb-8">
        {currentOrders.length === 0 ? (
          <div className="text-center py-16 border border-gray-200 rounded-lg bg-white">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-900 text-sm font-medium">No orders found</p>
            <p className="text-gray-500 text-xs mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          currentOrders.map((order) => (
            <div
              key={order.orderId}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors bg-white"
            >
              {/* Order Header */}
              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-2">
                      {getStatusIcon(order.status)}
                      <h3 className="font-medium text-base text-gray-900">
                        {order.orderId}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <p>{order.date}</p>
                      <p>
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"} · ৳
                        {order.total.toFixed(2)}
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-gray-700">
                          Est. delivery: {order.estimatedDelivery}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    {order.trackingNumber && (
                      <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700">
                        <Truck className="w-3.5 h-3.5" />
                        Track
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Return
                      </button>
                    )}
                    <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700">
                      <Download className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                    <button
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.orderId ? null : order.orderId
                        )
                      }
                      className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                    >
                      Details
                      {expandedOrder === order.orderId ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.orderId && (
                <div className="border-t border-gray-200 bg-gray-50 p-5 md:p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm text-gray-900">
                        Items Ordered
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200"
                          >
                            <div className="w-14 h-14 bg-gray-50 rounded flex items-center justify-center text-2xl flex-shrink-0">
                              {item.image}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs text-gray-900 leading-relaxed">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Qty: {item.qty}
                              </p>
                              <p className="text-xs font-medium mt-1 text-gray-900">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm text-gray-900">
                        Order Information
                      </h4>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3 text-xs">
                        <div>
                          <p className="text-gray-500 mb-1">Delivery Address</p>
                          <p className="font-medium text-gray-900">
                            {order.deliveryAddress}
                          </p>
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <p className="text-gray-500 mb-1">
                              Tracking Number
                            </p>
                            <p className="font-mono text-xs bg-gray-50 px-2 py-1 rounded inline-block text-gray-900 border border-gray-200">
                              {order.trackingNumber}
                            </p>
                          </div>
                        )}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-gray-900">
                              ${(order.total * 0.9).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Shipping</span>
                            <span className="text-gray-900">
                              ${(order.total * 0.05).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Tax</span>
                            <span className="text-gray-900">
                              ${(order.total * 0.05).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium text-sm pt-2 border-t border-gray-200">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg transition-colors text-sm ${
                  currentPage === page
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center mt-4 text-xs text-gray-500">
        Showing {indexOfFirstOrder + 1}–
        {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
        {filteredOrders.length} orders
      </div>
    </div>
  );
};

export default OrderHistoryPage;
