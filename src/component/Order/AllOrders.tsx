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
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "processing":
        return <Package className="w-5 h-5 text-amber-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">Order History</h1>
        <p className="text-gray-600">View and manage your past orders</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center gap-2 justify-center sm:justify-start"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <label className="block text-sm font-medium mb-2">
              Order Status
            </label>
            <div className="flex flex-wrap gap-2">
              {["all", "delivered", "shipped", "processing", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      filterStatus === status
                        ? "bg-black text-white"
                        : "bg-white border border-gray-300 hover:border-gray-400"
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
      <div className="space-y-4 mb-8">
        {currentOrders.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          currentOrders.map((order) => (
            <div
              key={order.orderId}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="p-4 md:p-6 bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(order.status)}
                      <h3 className="font-semibold text-lg">
                        Order {order.orderId}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Placed on {order.date}</p>
                      <p>
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"} • $
                        {order.total.toFixed(2)}
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-blue-600">
                          Estimated delivery: {order.estimatedDelivery}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    {order.trackingNumber && (
                      <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Track
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Return
                      </button>
                    )}
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Invoice
                    </button>
                    <button
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.orderId ? null : order.orderId
                        )
                      }
                      className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center gap-2"
                    >
                      Details
                      {expandedOrder === order.orderId ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.orderId && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 md:p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 bg-white p-3 rounded-md"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-3xl">
                              {item.image}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.qty}
                              </p>
                              <p className="text-sm font-medium mt-1">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="font-medium mb-3">Order Information</h4>
                      <div className="bg-white p-4 rounded-md space-y-3 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Delivery Address</p>
                          <p className="font-medium">{order.deliveryAddress}</p>
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <p className="text-gray-600 mb-1">
                              Tracking Number
                            </p>
                            <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded inline-block">
                              {order.trackingNumber}
                            </p>
                          </div>
                        )}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${(order.total * 0.9).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Shipping</span>
                            <span>${(order.total * 0.05).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Tax</span>
                            <span>${(order.total * 0.05).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
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
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-md transition ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "border border-gray-300 hover:bg-gray-50"
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
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Showing {indexOfFirstOrder + 1}-
        {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
        {filteredOrders.length} orders
      </div>
    </div>
  );
};

export default OrderHistoryPage;
