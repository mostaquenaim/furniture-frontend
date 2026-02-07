/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FullOrder,
  GetAllOrdersOptions,
  PaginatedOrdersResponse,
  ThumbOrder,
} from "@/hooks/Order/useOrders";
import React, { Dispatch, SetStateAction } from "react";
import ChevronPagination from "../../Pagination/Pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Order {
  orderId: string;
  createdAt: string;
  status: string;
  itemCount: number;
  total: number;
}

interface Orders {
  data: Order[];
  meta: {
    totalPages: number;
    page: number;
  };
}

interface OrderSectionProps {
  orders: PaginatedOrdersResponse<ThumbOrder | FullOrder> | null;
  refetch: (params?: any) => void;
  options?: any;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  orderOptions: GetAllOrdersOptions;
  setOrderOptions: Dispatch<SetStateAction<GetAllOrdersOptions>>;
}

const OrdersSection: React.FC<OrderSectionProps> = ({
  orders,
  refetch,
  options,
  getStatusColor,
  getStatusIcon,
  orderOptions,
  setOrderOptions,
}) => {
  return (
    <div>
      <h1 className="text-3xl font-light mb-8">Order History</h1>

      <div className="space-y-4">
        {orders?.data.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border border-gray-200 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">Order {order.orderId}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    {order.itemCount} item
                    {order.itemCount && order.itemCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-lg font-medium">
                    ৳{order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <ChevronPagination
        currentPage={orders?.meta.page ?? 1}
        totalPages={orders?.meta.totalPages ?? 1}
        onPageChange={(page) => setOrderOptions({ ...orderOptions, page })}
      />
    </div>
  );
};

export default OrdersSection;
