/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useOrders, {
  FullOrder,
  OrderStatus,
  PaymentStatus,
} from "@/hooks/Order/useOrders";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import toast from "react-hot-toast";
import {
  Package,
  Printer,
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  Truck,
  Clock,
  RotateCcw,
  Ban,
} from "lucide-react";

import {
  Badge,
  StatCard,
  SearchBar,
  FilterSelect,
  DateRangePicker,
  RefreshButton,
  ClearFiltersButton,
  AdminTable,
  Pagination,
  DetailDrawer,
  DrawerSection,
  DrawerRow,
  PageHeader,
} from "@/component/Shared/Admin/AdminUI/AdminUI";
import useTrackOrder, { TrackedOrder } from "@/hooks/Track/useTrack";
import { useRouter } from "next/navigation";

// ── Status configs ─────────────────────────────────────────────────────────────
const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; color: string; dot: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
    icon: <Clock className="w-3 h-3" />,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  PACKED: {
    label: "Packed",
    color: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
    icon: <Package className="w-3 h-3" />,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-amber-50 text-amber-700",
    dot: "bg-amber-400 animate-pulse",
    icon: <Truck className="w-3 h-3" />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700",
    dot: "bg-red-500",
    icon: <Ban className="w-3 h-3" />,
  },
  RETURNED: {
    label: "Returned",
    color: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    icon: <RotateCcw className="w-3 h-3" />,
  },
};

const PAYMENT_STATUS: Record<PaymentStatus, { label: string; color: string }> =
  {
    PENDING: { label: "Pending", color: "bg-slate-100 text-slate-600" },
    PROCESSING: { label: "Processing", color: "bg-blue-50 text-blue-700" },
    PAID: { label: "Paid", color: "bg-emerald-50 text-emerald-700" },
    FAILED: { label: "Failed", color: "bg-red-50 text-red-700" },
    REFUNDED: { label: "Refunded", color: "bg-orange-50 text-orange-700" },
    PARTIALLY_REFUNDED: {
      label: "Partial Ref",
      color: "bg-amber-50 text-amber-700",
    },
    CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-700" },
    EXPIRED: { label: "Expired", color: "bg-slate-100 text-slate-500" },
    ON_HOLD: { label: "On Hold", color: "bg-yellow-50 text-yellow-700" },
  };

const taka = (n: number) =>
  `৳ ${Number(n).toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ── Status flow for the mini timeline ─────────────────────────────────────────
const STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

// ── OrderStatusTimeline ───────────────────────────────────────────────────────
function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const isSpecial = ["CANCELLED", "RETURNED"].includes(status);
  const flow = isSpecial ? (["PENDING", status] as OrderStatus[]) : STATUS_FLOW;
  const currentIdx = flow.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {flow.map((s, i) => {
        const cfg = ORDER_STATUS[s];
        const done = i <= currentIdx;
        const current = s === status;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  current
                    ? "border-[#0f172a] bg-[#0f172a]"
                    : done
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-200 bg-white"
                }`}
              >
                {current ? (
                  <span className="text-white w-3 h-3">{cfg.icon}</span>
                ) : done ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full bg-slate-200`} />
                )}
              </div>
              <p
                className={`text-[8px] font-bold uppercase text-center leading-tight max-w-[44px] ${
                  current
                    ? "text-[#0f172a]"
                    : done
                      ? "text-emerald-600"
                      : "text-slate-300"
                }`}
              >
                {cfg.label}
              </p>
            </div>
            {i < flow.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-4 min-w-[12px] ${
                  i < currentIdx ? "bg-emerald-300" : "bg-slate-100"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── StatusChangeDropdown ──────────────────────────────────────────────────────
function StatusDropdown({
  orderId,
  currentStatus,
  onChanged,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  onChanged: () => void;
}) {
  const axiosSecure = useAxiosSecure();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const statuses = Object.keys(ORDER_STATUS) as OrderStatus[];

  const handleChange = async (status: OrderStatus) => {
    if (status === currentStatus) {
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      await axiosSecure.patch(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${ORDER_STATUS[status].label}`);
      onChanged();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to update status");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const cfg = ORDER_STATUS[currentStatus];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-slate-300 transition-all ${cfg.color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 min-w-[160px] overflow-hidden">
          {statuses.map((s) => {
            const c = ORDER_STATUS[s];
            return (
              <button
                key={s}
                onClick={() => handleChange(s)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 transition-colors text-left ${
                  s === currentStatus ? "opacity-40 cursor-default" : ""
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                <span className="font-medium text-slate-700">{c.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Order Detail Drawer ───────────────────────────────────────────────────────
function OrderDetailDrawer({
  orderId,
  onClose,
  onRefresh,
}: {
  orderId: string;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { order, isLoading, refetch } = useTrackOrder({
    trackingId: orderId,
    details: true,
  });

  const handlePrintInvoice = async () => {
    if (!order) return;
    try {
      const r = await axiosSecure.get(
        `/orders/admin/${order.orderNumber}/invoice/pdf`,
        {
          responseType: "blob",
        },
      );
      const url = URL.createObjectURL(
        new Blob([r.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order.orderNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to generate invoice");
    }
  };

  const createShipment = (orderId?: string) => {
    router.push(`/admin/courier?orderId=${orderId}`);
  };

  return (
    <DetailDrawer
      open={!!orderId}
      onClose={onClose}
      title={order?.orderNumber ?? "Loading…"}
      subtitle={order ? fmtDateTime(order.orderDate) : undefined}
      headerActions={
        <button
          onClick={() => createShipment(order?.orderNumber)}
          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Shipment
        </button>
      }
    >
      {loading || isLoading || !order ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
      ) : (
        <>
          {/* Status timeline */}
          <DrawerSection title="Order Progress">
            <div className="py-2">
              <OrderStatusTimeline status={order.status} />
            </div>
          </DrawerSection>

          {/* Status controls */}
          <DrawerSection title="Change Status">
            <div className="flex flex-wrap gap-2 pt-1">
              {(Object.keys(ORDER_STATUS) as OrderStatus[]).map((s) => {
                const cfg = ORDER_STATUS[s];
                const isCurrent = order.status === s;
                return (
                  <button
                    key={s}
                    disabled={isCurrent}
                    onClick={async () => {
                      await axiosSecure.patch(
                        `/orders/${order.orderNumber}/status`,
                        {
                          status: s,
                        },
                      );
                      toast.success(`Status → ${cfg.label}`);
                      refetch();
                      onRefresh();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all ${
                      isCurrent
                        ? `${cfg.color} border-current opacity-100 cursor-default`
                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                    }`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </DrawerSection>

          {/* Customer */}
          <DrawerSection title="Customer">
            <DrawerRow label="Name" value={order.shippingAddress.name} />
            <DrawerRow label="Phone" value={order.shippingAddress.phone} mono />
            {order.shippingAddress.phone && (
              <DrawerRow label="Phone" value={order.shippingAddress.phone} />
            )}
            {order.shippingAddress && (
              <DrawerRow
                label="Address"
                value={order.shippingAddress.address}
              />
            )}
            <DrawerRow
              label="District"
              value={order.shippingAddress.district}
            />
          </DrawerSection>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <DrawerSection title="Order Items">
              <div className="space-y-2 pt-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {[item.color, item.size, item.sku]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-semibold text-slate-800">
                        {taka(item.price)}
                      </p>
                      {/* <p className="text-[10px] text-slate-400">
                        {item.quantity} × {taka(item.priceAtPurchase)}
                      </p> */}
                    </div>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}

          {/* Financials */}
          <DrawerSection title="Financials" tint="slate">
            <DrawerRow
              label="Subtotal"
              value={taka(
                order.total -
                  (order.deliveryCharge ?? 0) +
                  (order.discount ?? 0),
              )}
            />
            {(order.discount ?? 0) > 0 && (
              <DrawerRow
                label="Discount"
                value={`− ${taka(order.discount ?? 0)}`}
              />
            )}
            <DrawerRow
              label="Delivery"
              value={order.deliveryCharge ? taka(order.deliveryCharge) : "Free"}
            />
            <DrawerRow label="Total" value={taka(order.total)} highlight />
            <div className="mt-3 pt-3 border-t border-slate-100">
              <DrawerRow
                label="Payment Status"
                value={
                  PAYMENT_STATUS[order.paymentStatus]?.label ??
                  order.paymentStatus
                }
              />
              {order.awbNumber && (
                <DrawerRow
                  label="AWB / Tracking"
                  value={order.awbNumber}
                  mono
                />
              )}
            </div>
          </DrawerSection>

          {/* Payments */}
          {order.payments && order.payments.length > 0 && (
            <DrawerSection title="Payment Records">
              {order.payments.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-700">
                      {p.method}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {p.transactionId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-semibold text-slate-800">
                      {taka(p.amount)}
                    </p>
                    <Badge
                      label={p.status}
                      colorClass={
                        PAYMENT_STATUS[p.status as PaymentStatus]?.color ??
                        "bg-slate-100 text-slate-600"
                      }
                    />
                  </div>
                </div>
              ))}
            </DrawerSection>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handlePrintInvoice}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Invoice
            </button>
          </div>
        </>
      )}
    </DetailDrawer>
  );
}

// ── Row action menu ───────────────────────────────────────────────────────────
function RowMenu({
  order,
  onView,
  onRefresh,
}: {
  order: FullOrder;
  onView: () => void;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1.5 min-w-[140px] overflow-hidden">
          <button
            onClick={() => {
              onView();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const LIMIT = 20;

const ORDER_STATUS_OPTIONS = (Object.keys(ORDER_STATUS) as OrderStatus[]).map(
  (s) => ({ label: ORDER_STATUS[s].label, value: s }),
);

export default function AllOrdersComponent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const {
    orders,
    isLoading,
    // meta, statusCounts, loading,
    refetch,
  } = useOrders({
    page,
    limit: LIMIT,
    search: search || undefined,
    status: status || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  console.log(orders, "allorders");

  // Debounce search
  const searchTimer = useRef<NodeJS.Timeout | null>(null);
  const handleSearch = (v: string) => {
    setSearch(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setPage(1), 400);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  const hasFilters = !!(search || status || from || to);

  const typedOrders = (orders?.data ?? []) as FullOrder[];
  const typedMeta = orders?.meta ?? {
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  };

  // Build status summary from statusCounts
  const topStats = [
    { label: "Total", value: typedMeta.total },
    { label: "Pending", value: orders?.statusCounts?.PENDING ?? 0 },
    { label: "Shipped", value: orders?.statusCounts?.SHIPPED ?? 0 },
    { label: "Delivered", value: orders?.statusCounts?.DELIVERED ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <PageHeader eyebrow="Commerce" title="All Orders">
        <div className="hidden md:flex items-center gap-4">
          {orders?.statusCounts?.PENDING && orders.statusCounts.PENDING > 0 && (
            <div className="text-right">
              <p className="text-lg font-bold font-mono text-amber-400">
                {orders.statusCounts.PENDING}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Pending
              </p>
            </div>
          )}
          {orders?.statusCounts?.DELIVERED &&
            orders.statusCounts.DELIVERED > 0 && (
              <div className="text-right">
                <p className="text-lg font-bold font-mono text-emerald-400">
                  {orders.statusCounts.DELIVERED}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Delivered
                </p>
              </div>
            )}
        </div>
      </PageHeader>

      <div className="max-w-350 mx-auto px-8 py-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topStats.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              accent={i === 0}
            />
          ))}
        </div>

        {/* Status pill tabs */}
        {orders?.statusCounts && (
          <div className="flex gap-1.5 flex-wrap bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
            <TabPill
              label="All"
              count={typedMeta.total}
              active={status === ""}
              onClick={() => {
                setStatus("");
                setPage(1);
              }}
            />
            {(Object.keys(ORDER_STATUS) as OrderStatus[]).map((s) => {
              const count = orders?.statusCounts?.[s] ?? 0;
              if (count === 0) return null;
              return (
                <TabPill
                  key={s}
                  label={ORDER_STATUS[s].label}
                  count={count}
                  active={status === s}
                  onClick={() => {
                    setStatus(s);
                    setPage(1);
                  }}
                  dot={ORDER_STATUS[s].dot}
                />
              );
            })}
          </div>
        )}

        {/* Filters row */}
        <div className="flex items-center gap-3 flex-wrap">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search name, phone, order ID…"
            className="flex-1 min-w-55"
          />
          <FilterSelect
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={ORDER_STATUS_OPTIONS}
            placeholder="All Statuses"
          />
          <DateRangePicker
            from={from}
            to={to}
            onFromChange={(v) => {
              setFrom(v);
              setPage(1);
            }}
            onToChange={(v) => {
              setTo(v);
              setPage(1);
            }}
          />
          {hasFilters && <ClearFiltersButton onClick={clearFilters} />}
          <RefreshButton onClick={() => refetch()} loading={isLoading} />
        </div>

        {/* Table */}
        <AdminTable
          headers={[
            "Order",
            "Customer",
            "Items",
            "Total",
            "Order Status",
            "Payment",
            "Date",
            "",
          ]}
          loading={isLoading}
          empty={typedOrders.length === 0}
          emptyAction={
            hasFilters ? (
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            ) : undefined
          }
        >
          {typedOrders.map((order, i) => (
            <tr
              key={order.id}
              className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              style={{ animationDelay: `${i * 20}ms` }}
              onClick={() => setDetailId(order.orderId)}
            >
              {/* Order ID */}
              <td className="px-5 py-3.5">
                <p className="font-mono text-xs font-semibold text-slate-800 group-hover:text-[#0f172a]">
                  {order.orderId}
                </p>
                {order.awbNumber && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    AWB: {order.awbNumber}
                  </p>
                )}
              </td>

              {/* Customer */}
              <td className="px-4 py-3.5">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {order.customerName}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {order.customerPhone}
                </p>
                {order.districtName && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {order.districtName}
                  </p>
                )}
              </td>

              {/* Items count */}
              <td className="px-4 py-3.5">
                <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {order.itemCount ??
                    order.items?.reduce((s, i) => s + i.quantity, 0) ??
                    "—"}{" "}
                  pcs
                </span>
              </td>

              {/* Total */}
              <td className="px-4 py-3.5">
                <p className="text-sm font-mono font-bold text-slate-900">
                  {taka(order.total)}
                </p>
                {(order.discount ?? 0) > 0 && (
                  <p className="text-[10px] text-emerald-600 mt-0.5">
                    − {taka(order.discount ?? 0)} off
                  </p>
                )}
              </td>

              {/* Status (clickable dropdown, stop propagation) */}
              <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                <StatusDropdown
                  orderId={order.orderId}
                  currentStatus={order.status}
                  onChanged={refetch}
                />
              </td>

              {/* Payment status */}
              <td className="px-4 py-3.5">
                <Badge
                  label={
                    PAYMENT_STATUS[order.paymentStatus]?.label ??
                    order.paymentStatus
                  }
                  colorClass={
                    PAYMENT_STATUS[order.paymentStatus]?.color ??
                    "bg-slate-100 text-slate-600"
                  }
                />
              </td>

              {/* Date */}
              <td className="px-4 py-3.5">
                <p className="text-xs text-slate-500">
                  {fmtDate(order.createdAt)}
                </p>
              </td>

              {/* Action menu */}
              <td
                className="px-4 py-3.5 pr-5"
                onClick={(e) => e.stopPropagation()}
              >
                <RowMenu
                  order={order}
                  onView={() => setDetailId(order.orderId)}
                  onRefresh={refetch}
                />
              </td>
            </tr>
          ))}
        </AdminTable>

        {/* Pagination */}
        <Pagination
          meta={typedMeta}
          page={page}
          onPageChange={setPage}
          limit={LIMIT}
        />
      </div>

      {/* Detail Drawer */}
      {detailId && (
        <OrderDetailDrawer
          orderId={detailId}
          onClose={() => setDetailId(null)}
          onRefresh={refetch}
        />
      )}
    </div>
  );
}

// ── TabPill ───────────────────────────────────────────────────────────────────
function TabPill({
  label,
  count,
  active,
  onClick,
  dot,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
        active
          ? "bg-[#0f172a] text-white shadow-sm"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
      }`}
    >
      {dot && !active && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
      <span
        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
