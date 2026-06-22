/* eslint-disable @typescript-eslint/no-explicit-any */
// Shared types for the Return Requests / Refunds feature.
// Mirrors the backend's Prisma enums & RefundService response shapes 1:1.

export type ReturnRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ITEM_RECEIVED"
  | "REFUNDED"
  | "CANCELLED";

export type RefundStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type RefundMethod = "GATEWAY" | "MANUAL";

export interface OrderItemSnapshot {
  id: number;
  productId: number;
  productTitle: string;
  sku?: string | null;
  color?: string | null;
  size?: string | null;
  quantity: number;
  priceAtPurchase: number;
  basePriceAtPurchase: number;
  totalPriceAtPurchase: number;
}

export interface ReturnRequestItem {
  id: number;
  returnRequestId: number;
  orderItemId: number;
  quantity: number;
  orderItem?: OrderItemSnapshot;
}

export interface ReturnRequestOrderSummary {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  status?: string;
  total?: number;
}

export interface PaymentRefund {
  id: number;
  paymentId: number;
  returnRequestId?: number | null;
  amount: number;
  reason?: string | null;
  status: RefundStatus;
  refundMethod: RefundMethod;
  gatewayRefundId?: string | null;
  gatewayResponse?: any;
  requestedBy?: number | null;
  processedBy?: number | null;
  processedAt?: string | null;
  notes?: string | null;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  payment?: {
    id: number;
    transactionId: string;
    method: string;
    orderId: number;
    order?: { orderId: string; customerName?: string };
  };
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  requestedBy?: number | null;
  reason: string;
  note?: string | null;
  previousOrderStatus: string;
  status: ReturnRequestStatus;
  adminNote?: string | null;
  reviewedBy?: number | null;
  reviewedAt?: string | null;
  receivedBy?: number | null;
  receivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: ReturnRequestItem[];
  refunds?: PaymentRefund[];
  order?: ReturnRequestOrderSummary;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedReturnRequests {
  data: ReturnRequest[];
  meta: Meta;
}

export interface PaginatedRefunds {
  data: PaymentRefund[];
  meta: Meta;
}
