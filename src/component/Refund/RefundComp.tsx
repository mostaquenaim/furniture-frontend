"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Package,
  CreditCard,
  MessageSquare,
  ExternalLink,
  ArrowLeft,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface RefundItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  reason: string;
  condition: "unopened" | "used" | "damaged";
  image: string;
}

interface RefundRequest {
  id: string;
  orderId: string;
  dateSubmitted: string;
  status: "pending" | "approved" | "rejected" | "processed";
  refundAmount: number;
  refundMethod: "original_payment" | "store_credit";
  items: RefundItem[];
  customerNote?: string;
  adminResponse?: string;
  estimatedCompletion?: string;
  trackingNumber?: string;
  labelAvailable: boolean;
}

const mockRefunds: RefundRequest[] = [
  {
    id: "REF-78901",
    orderId: "SAK-10234",
    dateSubmitted: "Jan 10, 2026",
    status: "approved",
    refundAmount: 349.5,
    refundMethod: "original_payment",
    estimatedCompletion: "Jan 17, 2026",
    labelAvailable: true,
    items: [
      {
        id: "2",
        name: "Minimal Side Table",
        qty: 2,
        price: 174.5,
        reason: "Not as expected",
        condition: "unopened",
        image: "🪵",
      },
    ],
    customerNote: "The color was different than shown online.",
  },
  {
    id: "REF-78892",
    orderId: "SAK-09956",
    dateSubmitted: "Sep 28, 2025",
    status: "processed",
    refundAmount: 234.0,
    refundMethod: "store_credit",
    trackingNumber: "RET456789123",
    labelAvailable: false,
    items: [
      {
        id: "10",
        name: "Glass Dinner Plates Set",
        qty: 1,
        price: 234.0,
        reason: "Damaged upon arrival",
        condition: "damaged",
        image: "🍽️",
      },
    ],
    customerNote: "Two plates arrived cracked.",
    adminResponse: "Refund processed as store credit. We apologize for the inconvenience.",
  },
  {
    id: "REF-78815",
    orderId: "SAK-10012",
    dateSubmitted: "Oct 12, 2025",
    status: "rejected",
    refundAmount: 678.0,
    refundMethod: "original_payment",
    labelAvailable: false,
    items: [
      {
        id: "9",
        name: "Marble Coffee Table",
        qty: 1,
        price: 678.0,
        reason: "Changed my mind",
        condition: "used",
        image: "⬜",
      },
    ],
    customerNote: "Doesn't fit my space.",
    adminResponse: "Return window has expired for this order (30 days from delivery).",
  },
  {
    id: "REF-78945",
    orderId: "SAK-10198",
    dateSubmitted: "Jan 6, 2026",
    status: "pending",
    refundAmount: 129.0,
    refundMethod: "original_payment",
    labelAvailable: true,
    items: [
      {
        id: "3",
        name: "Ceramic Vase Set",
        qty: 1,
        price: 129.0,
        reason: "Item defective",
        condition: "unopened",
        image: "🏺",
      },
    ],
    customerNote: "Glaze is uneven and has cracks.",
  },
  {
    id: "REF-78962",
    orderId: "SAK-10145",
    dateSubmitted: "Jan 8, 2026",
    status: "pending",
    refundAmount: 441.0,
    refundMethod: "store_credit",
    labelAvailable: true,
    items: [
      {
        id: "7",
        name: "Decorative Pillows",
        qty: 4,
        price: 110.25,
        reason: "Not as described",
        condition: "unopened",
        image: "🛏️",
      },
    ],
    customerNote: "Material feels cheaper than advertised.",
  },
];

const RefundComp = () => {
  const [refunds] = useState<RefundRequest[]>(mockRefunds);
  const [expandedRefund, setExpandedRefund] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewRequest, setShowNewRequest] = useState(false);

  const refundsPerPage = 4;

  const filteredRefunds = refunds.filter((refund) => {
    const matchesStatus =
      filterStatus === "all" || refund.status === filterStatus;
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const indexOfLastRefund = currentPage * refundsPerPage;
  const indexOfFirstRefund = indexOfLastRefund - refundsPerPage;
  const currentRefunds = filteredRefunds.slice(
    indexOfFirstRefund,
    indexOfLastRefund
  );
  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);

  const getStatusIcon = (status: RefundRequest["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case "processed":
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: RefundRequest["status"]) => {
    switch (status) {
      case "approved":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "processed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "rejected":
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: RefundRequest["status"]) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "processed":
        return "Completed";
      case "pending":
        return "Under Review";
      case "rejected":
        return "Declined";
    }
  };

  const formatRefundMethod = (method: RefundRequest["refundMethod"]) => {
    return method === "original_payment"
      ? "Original Payment Method"
      : "Store Credit";
  };

  const NewRefundRequest = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              New Refund Request
            </h2>
            <button
              onClick={() => setShowNewRequest(false)}
              className="p-1 hover:bg-gray-100 rounded-sm"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Number
            </label>
            <input
              type="text"
              placeholder="Enter order number (e.g., SAK-10234)"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Return
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
              <option value="">Select a reason</option>
              <option value="defective">Defective/Damaged Item</option>
              <option value="not-as-described">Not as Described</option>
              <option value="wrong-item">Wrong Item Received</option>
              <option value="changed-mind">Changed Mind</option>
              <option value="wrong-size">Wrong Size</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Condition
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
              <option value="">Select condition</option>
              <option value="unopened">Unopened & Unused</option>
              <option value="used">Used - Good Condition</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Preference
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="refundMethod" className="w-4 h-4" />
                <span className="text-sm text-gray-700">
                  Original Payment Method
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="refundMethod"
                  defaultChecked
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Store Credit</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Please provide any additional details about your return..."
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-medium">Return Policy Reminders:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Items must be returned within 30 days of delivery</li>
                  <li>Original packaging must be included when possible</li>
                  <li>
                    Refunds may be issued as store credit for final sale items
                  </li>
                  <li>
                    Shipping costs are non-refundable unless the return is due
                    to our error
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => setShowNewRequest(false)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {showNewRequest && <NewRefundRequest />}

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link
            href="/orders"
            className="hover:text-gray-700 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Orders
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-1">
              Refunds & Returns
            </h1>
            <p className="text-sm text-gray-500">
              Manage your return requests and refund status
            </p>
          </div>
          <button
            onClick={() => setShowNewRequest(true)}
            className="px-4 py-2.5 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition flex items-center gap-2 w-fit"
          >
            <FileText className="w-4 h-4" />
            New Return Request
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Total Requests</p>
          <p className="text-2xl font-medium text-gray-900">{refunds.length}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Pending Review</p>
          <p className="text-2xl font-medium text-gray-900">
            {refunds.filter((r) => r.status === "pending").length}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Approved</p>
          <p className="text-2xl font-medium text-gray-900">
            {refunds.filter((r) => r.status === "approved").length}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Total Refunded</p>
          <p className="text-2xl font-medium text-gray-900">
            ${refunds.reduce((sum, r) => sum + r.refundAmount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by request ID, order number, or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-300 rounded-sm hover:bg-gray-50 transition focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="processed">Completed</option>
              <option value="rejected">Declined</option>
            </select>
            <button className="px-4 py-2.5 text-sm border border-gray-300 rounded-sm hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Refunds List */}
      <div className="space-y-3 mb-8">
        {currentRefunds.length === 0 ? (
          <div className="text-center py-16 border border-gray-200 rounded-sm">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-700 text-base">No refund requests found</p>
            <p className="text-gray-500 text-xs mt-1">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't submitted any return requests yet"}
            </p>
          </div>
        ) : (
          currentRefunds.map((refund) => (
            <div
              key={refund.id}
              className="border border-gray-200 rounded-sm overflow-hidden"
            >
              {/* Refund Header */}
              <div className="p-5 bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(refund.status)}
                      <div>
                        <h3 className="font-medium text-base text-gray-900">
                          {refund.id}
                        </h3>
                        <p className="text-xs text-gray-500">
                          For Order {refund.orderId} • Submitted{" "}
                          {refund.dateSubmitted}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-sm text-xs font-normal border ${getStatusColor(
                          refund.status
                        )}`}
                      >
                        {getStatusText(refund.status)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <p>
                        {refund.items.length}{" "}
                        {refund.items.length === 1 ? "item" : "items"} • $
                        {refund.refundAmount.toFixed(2)} refund
                      </p>
                      <p>Refund to: {formatRefundMethod(refund.refundMethod)}</p>
                      {refund.estimatedCompletion && (
                        <p className="text-gray-600">
                          Estimated completion: {refund.estimatedCompletion}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    {refund.labelAvailable && refund.status === "approved" && (
                      <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-50 transition flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Print Label
                      </button>
                    )}
                    {refund.trackingNumber && (
                      <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-50 transition flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" />
                        Track Return
                      </button>
                    )}
                    <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-50 transition flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Contact Support
                    </button>
                    <button
                      onClick={() =>
                        setExpandedRefund(
                          expandedRefund === refund.id ? null : refund.id
                        )
                      }
                      className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition flex items-center gap-1.5"
                    >
                      Details
                      {expandedRefund === refund.id ? (
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Refund Details */}
              {expandedRefund === refund.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-5">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Items and Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3 text-gray-900">
                          Items Being Returned
                        </h4>
                        <div className="space-y-3">
                          {refund.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-3 bg-white p-3 rounded-sm border border-gray-100"
                            >
                              <div className="w-14 h-14 bg-gray-50 rounded-sm flex items-center justify-center text-2xl border border-gray-100">
                                {item.image}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-xs text-gray-900">
                                  {item.name}
                                </p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Qty:</span>
                                    <span className="text-gray-900">
                                      {item.qty}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                      Price:
                                    </span>
                                    <span className="text-gray-900">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                      Reason:
                                    </span>
                                    <span className="text-gray-900">
                                      {item.reason}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                      Condition:
                                    </span>
                                    <span className="text-gray-900">
                                      {item.condition}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Notes */}
                      {refund.customerNote && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-gray-900">
                            Your Notes
                          </h4>
                          <div className="bg-white p-3 rounded-sm border border-gray-100">
                            <p className="text-xs text-gray-700">
                              {refund.customerNote}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className="space-y-6">
                      {/* Refund Breakdown */}
                      <div>
                        <h4 className="font-medium text-sm mb-3 text-gray-900">
                          Refund Breakdown
                        </h4>
                        <div className="bg-white p-4 rounded-sm border border-gray-100 space-y-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Item Total</span>
                            <span className="text-gray-900">
                              ${refund.refundAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Return Shipping</span>
                            <span className="text-gray-900">
                              {refund.labelAvailable ? "Free" : "$0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Restocking Fee</span>
                            <span className="text-gray-900">$0.00</span>
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex justify-between font-medium text-sm">
                              <span className="text-gray-900">
                                Total Refund
                              </span>
                              <span className="text-gray-900">
                                ${refund.refundAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              <p>
                                Method: {formatRefundMethod(refund.refundMethod)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Admin Response */}
                      {refund.adminResponse && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-gray-900">
                            Response from Support
                          </h4>
                          <div className="bg-white p-3 rounded-sm border border-gray-100">
                            <p className="text-xs text-gray-700">
                              {refund.adminResponse}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Next Steps */}
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-gray-900">
                          Next Steps
                        </h4>
                        <div className="space-y-2">
                          {refund.status === "approved" && (
                            <div className="flex items-start gap-2 text-xs">
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-xs">1</span>
                              </div>
                              <p className="text-gray-700">
                                Print your return label and include it with your package
                              </p>
                            </div>
                          )}
                          {refund.status === "approved" && (
                            <div className="flex items-start gap-2 text-xs">
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-xs">2</span>
                              </div>
                              <p className="text-gray-700">
                                Drop off at any authorized carrier location
                              </p>
                            </div>
                          )}
                          {refund.status === "pending" && (
                            <div className="flex items-start gap-2 text-xs">
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-xs">1</span>
                              </div>
                              <p className="text-gray-700">
                                Your request is under review. You'll receive an update within 2-3 business days.
                              </p>
                            </div>
                          )}
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
            className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-xs rounded-sm transition ${
                  currentPage === page
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
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
            className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center mt-4 text-xs text-gray-500">
        Showing {indexOfFirstRefund + 1}-
        {Math.min(indexOfLastRefund, filteredRefunds.length)} of{" "}
        {filteredRefunds.length} refund requests
      </div>

      {/* Help Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="font-medium text-base text-gray-900 mb-4">
          Need Help with Your Return?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Return Policy
                </p>
                <p className="text-xs text-gray-600">
                  Learn about our 30-day return window and conditions.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Contact Support
                </p>
                <p className="text-xs text-gray-600">
                  Get help with your return or ask questions.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Refund Methods
                </p>
                <p className="text-xs text-gray-600">
                  Understand how and when you'll receive your refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundComp;